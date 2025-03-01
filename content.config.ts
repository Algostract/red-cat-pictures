import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { defineContentConfig, defineCollection, defineCollectionSource, z } from '@nuxt/content'
import slugify from './shared/utils/slugify'

let notion: Client
let n2m: NotionToMarkdown
const config = {
  private: {
    notionApiKey: process.env.NUXT_PRIVATE_NOTION_API_KEY,
    notionDbId: process.env.NUXT_PRIVATE_NOTION_DB_ID!,
  },
}

async function convertNotionPageToMarkdown(pageId: string) {
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

const notionSource = defineCollectionSource({
  getKeys: () => {
    notion = notion ?? new Client({ auth: config.private.notionApiKey })

    return notion.databases
      .query({
        database_id: config.private.notionDbId,
      })
      .then((data) => {
        const episodes = data.results as unknown as NotionEpisode[]
        return episodes
          .map(({ id, properties }) => {
            if (properties['Content type'].select?.name !== 'Blog article') return null

            if (properties.Status.status.name !== 'Published') return null

            return `${slugify(properties['Content name'].title[0]?.plain_text ?? '')}_${id}.json`
          })
          .filter((item) => item !== null)
      })
  },
  getItem: (key: string) => {
    notion = notion ?? new Client({ auth: config.private.notionApiKey })
    n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })
    const [name, _ext] = key.split('.')

    const pageId = name?.split('_').at(-1)
    if (!pageId) {
      throw new Error('Invalid page ID')
    }
    return notion.pages.retrieve({ page_id: pageId }).then(async (_blog) => {
      const episode = _blog as unknown as NotionEpisode
      const epidoseContent = await convertNotionPageToMarkdown(episode.id)
      const id = `${slugify(episode.properties['Content name'].title[0]?.plain_text ?? '')}_${episode.id}`

      const epidoseData = {
        id: `${id}.json`,
        title: (episode.properties['Content name'].title[0]?.plain_text ?? '') as string,
        cover: episode.cover?.external.url?.split('/')[3] ?? null,
        createdAt: episode.created_time as string,
        modifiedAt: episode.last_edited_time as string,
        content: epidoseContent,
        url: `/episode/${id}`,
      }

      return JSON.parse(JSON.stringify(epidoseData))
    })
  },
})

export default defineContentConfig({
  collections: {
    notion: defineCollection({
      type: 'data',
      source: notionSource,
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        cover: z.string(),
        createdAt: z.string(),
        modifiedAt: z.string(),
        content: z.string(),
        url: z.string(),
      }),
    }),
  },
})
