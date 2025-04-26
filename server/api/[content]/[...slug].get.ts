import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { z } from 'zod'

let notion: Client
let n2m: NotionToMarkdown

export async function convertNotionPageToMarkdown(n2m: NotionToMarkdown, pageId: string) {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    let mdString = n2m.toMarkdownString(mdBlocks).parent

    // Replace literal "\n" with actual newlines
    mdString = mdString?.replace(/\\n/g, '\n')

    // Collapse triple (or more) newlines to double
    mdString = mdString?.replace(/\n{3,}/g, '\n\n')
    mdString = mdString?.replaceAll('\\n\\n', '\n\n')

    // Trim any extra whitespace
    mdString = mdString?.trim()

    return mdString
  } catch (error) {
    console.error('Error converting page:', error)
    throw error
  }
}

export default defineCachedEventHandler<Promise<ContentDetails>>(
  async (event) => {
    try {
      const config = useRuntimeConfig()
      if (!config.private.notionApiKey) {
        throw new Error('Notion API Key Not Found')
      }

      const { content: contentType, slug } = await getValidatedRouterParams(
        event,
        z.object({
          content: z.enum(['episode', 'blog']),
          slug: z.string().min(1),
        }).parse
      )

      notion = notion ?? new Client({ auth: config.private.notionApiKey })
      n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })

      const [name, _ext] = slug.split('.')
      const pageId = name?.split('_').at(-1)

      let episode: NotionContent | null = null
      try {
        if (!pageId) throw Error('Page Id not found')
        episode = (await notion.pages.retrieve({ page_id: pageId })) as unknown as NotionContent
      } catch {
        console.error('Notion Episode not found')
      }

      if (!episode) {
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      const content = await convertNotionPageToMarkdown(n2m, episode.id)
      const id = episode.id
      const title = episode.properties['Content name'].title.map(({ plain_text }) => plain_text ?? '').join('') as string

      return {
        id,
        title,
        cover: episode.cover?.external.url?.split('/')[3] ?? null,
        createdAt: episode.created_time as string,
        modifiedAt: episode.last_edited_time as string,
        publishedAt: episode.properties['Publish date'].date.start as string,
        description: `${mdToText(content.split('. ').splice(0, 2).join('. '))}...`,
        content: content,
        url: `/${contentType}/${slugify(title)}_${id}`,
      } as ContentDetails
    } catch (error: unknown) {
      console.error('API episode/slug GET', error)

      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 }
)
