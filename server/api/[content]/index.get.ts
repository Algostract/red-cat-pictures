import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { convertNotionPageToMarkdown } from './[...slug].get'
import { z } from 'zod'

let notion: Client
let n2m: NotionToMarkdown

type Content = 'Episode' | 'Blog'

export default defineCachedEventHandler<Promise<Content[]>>(
  async (event) => {
    try {
      const config = useRuntimeConfig()
      if (!config.private.notionApiKey) {
        throw new Error('Notion API Key Not Found')
      }

      const { content: contentType } = await getValidatedRouterParams(
        event,
        z.object({
          content: z.enum(['episode', 'blog']),
        }).parse
      )

      notion = notion ?? new Client({ auth: config.private.notionApiKey })
      n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })

      const data = await notion.databases.query({
        database_id: config.private.notionClientDbId,
      })

      const episodes = data.results as unknown as NotionContent[]

      const results = await Promise.all(
        episodes.map(async ({ id, properties }) => {
          if (properties['Content type'].select?.name.toLowerCase() !== contentType) return null
          if (properties.Status.status.name !== 'Published') return null

          const episode = (await notion.pages.retrieve({ page_id: id })) as unknown as NotionContent
          const episodeContent = await convertNotionPageToMarkdown(n2m, id)
          const title = properties['Content name'].title.map(({ plain_text }) => plain_text ?? '').join('') as string

          return {
            id,
            title,
            cover: episode.cover?.external.url?.split('/')[3] ?? null,
            createdAt: episode.created_time as string,
            modifiedAt: episode.last_edited_time as string,
            publishedAt: episode.properties['Publish date'].date.start as string,
            description: `${mdToText(episodeContent.split('. ').splice(0, 2).join('. '))}...`,
            url: `/${contentType}/${slugify(title)}_${id}`,
          }
        })
      )

      return results.filter((item) => item !== null).toSorted((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    } catch (error: unknown) {
      console.error('API episode GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 5 * 60 }
)
