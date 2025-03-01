import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

let notion: Client
let n2m: NotionToMarkdown

export interface Episode {
  id: string
  title: string
  cover: string
  createdAt: string
  modifiedAt: string
  description: string
  url: string
}

export interface EpisodeDetails extends Episode {
  content: string
}

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
      const slug = getRouterParam(event, 'slug')!.toString()

      if (!config.private.notionApiKey) {
        throw new Error('Notion API Key Not Found')
      }

      notion = notion ?? new Client({ auth: config.private.notionApiKey })
      n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })

      const [name, _ext] = slug.split('.')
      const pageId = name?.split('_').at(-1)
      if (!pageId) {
        throw new Error('Invalid page ID')
      }

      const _episode = await notion.pages.retrieve({ page_id: pageId })
      const episode = _episode as unknown as NotionEpisode
      const episodeContent = await convertNotionPageToMarkdown(n2m, episode.id)
      const id = `${slugify(episode.properties['Content name'].title[0]?.plain_text ?? '')}_${episode.id}`

      const episodeData: EpisodeDetails = {
        id,
        title: (episode.properties['Content name'].title[0]?.plain_text ?? '') as string,
        cover: episode.cover?.external.url?.split('/')[3] ?? null,
        createdAt: episode.created_time as string,
        modifiedAt: episode.last_edited_time as string,
        description: `${mdToText(episodeContent.split('. ').splice(0, 2).join('. '))}...`,
        content: episodeContent,
        url: `/episode/${id}`,
      }

      return episodeData
    } catch (error: unknown) {
      console.error('API episode/slug GET', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 }
)
