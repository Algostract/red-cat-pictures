import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { z } from 'zod'
import { convertNotionPageToMarkdown } from './[...slug].get'

let notion: Client
let n2m: NotionToMarkdown

export default defineCachedEventHandler<Promise<Content[]>>(
  async (event) => {
    try {
      const config = useRuntimeConfig()
      if (!config.private.notionApiKey) {
        throw new Error('Notion API Key Not Found')
      }

      const notionDbId = config.private.notionDbId as unknown as NotionDB

      const { content: contentType } = await getValidatedRouterParams(
        event,
        z.object({
          content: z.enum(['episode', 'blog']),
        }).parse
      )

      notion = notion ?? new Client({ auth: config.private.notionApiKey })
      n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })

      const contents = await notionQueryDb<NotionContent>(notion, notionDbId.content)

      const results = await Promise.all(
        contents.map(async ({ id, cover, properties, created_time, last_edited_time }): Promise<Content | null> => {
          if (properties['Type'].select?.name.toLowerCase() !== contentType) return null
          if (properties.Status.status.name !== 'Publish') return null

          const markdown = await convertNotionPageToMarkdown(n2m, id)
          const title = notionTextStringify(properties.Name.title)

          return {
            id,
            title,
            cover: cover?.type === 'external' ? cover.external.url.split('/')[3] : null,
            createdAt: created_time as string,
            modifiedAt: last_edited_time as string,
            publishedAt: properties['Publish date'].date.start as string,
            description: `${mdToText(markdown.split('. ').splice(0, 2).join('. '))}...`,
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
  { maxAge: 60 * 5 }
)
