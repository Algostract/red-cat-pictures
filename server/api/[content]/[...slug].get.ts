import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { z } from 'zod'

let notion: Client
let n2m: NotionToMarkdown

interface NotionResource {
  id: string
  created_time: string
  last_edited_time: string
  properties: {
    Name: { type: 'title'; title: string[] }
    Email: { type: 'email'; email: string }
    Phone: { type: 'phone_number'; phone_number: string }
    Instagram: { type: 'url'; url: string }
    Website: { type: 'url'; url: string }
    Project: { type: 'relation'; relation: string[]; has_more: false }
  }
}

export async function convertNotionPageToMarkdown(notion: Client, n2m: NotionToMarkdown, pageId: string, replaceNotionLinks: boolean = false) {
  try {
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    let mdString = n2m.toMarkdownString(mdBlocks).parent

    if (mdString) {
      // literal "\n" → actual newlines
      mdString = mdString.replace(/\\n/g, '\n')
      // collapse 3+ newlines → 2
      mdString = mdString.replace(/\n{3,}/g, '\n\n').replaceAll('\\n\\n', '\n\n')

      // async-replace all Notion links, unpacking (fullMatch, linkText, pageId)
      if (replaceNotionLinks)
        mdString = await replaceAsync(mdString, /\[([^\]]+)\]\(https?:\/\/(?:www\.)?notion\.so\/(?:[^\s/()]+-)?([0-9a-fA-F]{32})(?:\S*)?\)/g, async ([_fullMatch, linkText, pageId]) => {
          const content = (await notion.pages.retrieve({ page_id: pageId })) as unknown as NotionResource
          return `[${linkText}](${content.properties?.Website?.url ?? content.properties?.Instagram?.url})`
        })

      mdString = mdString.trim()
    }

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

      if (!pageId) {
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      let content: NotionContent
      try {
        content = (await notion.pages.retrieve({ page_id: pageId })) as unknown as NotionContent
      } catch {
        console.error('Notion Episode not found')
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      if (!content) {
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      const id = content.id
      const markdown = await convertNotionPageToMarkdown(notion, n2m, id, true)
      const title = content.properties['Content name'].title.map(({ plain_text }) => plain_text ?? '').join('') as string

      return {
        id,
        title,
        cover: content.cover?.external.url?.split('/')[3] ?? null,
        createdAt: content.created_time as string,
        modifiedAt: content.last_edited_time as string,
        publishedAt: content.properties['Publish date'].date.start as string,
        description: `${mdToText(markdown.split('. ').splice(0, 2).join('. '))}...`,
        markdown,
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
