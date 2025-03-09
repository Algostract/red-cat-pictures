import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

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

export default defineCachedEventHandler<Promise<EpisodeDetails>>(
  async (event) => {
    try {
      const config = useRuntimeConfig()
      const slug = getRouterParam(event, 'slug')!.toString().replace(/,$/, '')

      if (!config.private.notionApiKey) {
        throw new Error('Notion API Key Not Found')
      }

      notion = notion ?? new Client({ auth: config.private.notionApiKey })
      n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })

      const [name, _ext] = slug.split('.')
      const pageId = name?.split('_').at(-1)

      let episode: NotionEpisode | null = null
      try {
        if (!pageId) throw Error('Page Id not found')
        episode = (await notion.pages.retrieve({ page_id: pageId })) as unknown as NotionEpisode
      } catch {
        console.error('Notion Episode not found')
      }

      if (!episode) {
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      const episodeContent = await convertNotionPageToMarkdown(n2m, episode.id)
      const id = `${slugify(episode.properties['Content name'].title[0]?.plain_text ?? '')}_${episode.id}`
      const title = episode.properties['Content name'].title.map(({ plain_text }) => plain_text ?? '').join('') as string

      return {
        id,
        title,
        cover: episode.cover?.external.url?.split('/')[3] ?? null,
        createdAt: episode.created_time as string,
        modifiedAt: episode.last_edited_time as string,
        description: `${mdToText(episodeContent.split('. ').splice(0, 2).join('. '))}...`,
        content: episodeContent,
        url: `/episode/${slugify(title)}_${id}`,
      } as EpisodeDetails
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
