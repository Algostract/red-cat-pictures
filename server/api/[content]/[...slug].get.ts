import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { z } from 'zod'

let notion: Client
let n2m: NotionToMarkdown

export async function convertNotionPageToMarkdown(n2m: NotionToMarkdown, pageId: string, replaceNotionLinks: boolean = false) {
  try {
    const resourceStorage = useStorage<Resource>(`data:resource`)
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    let mdString = n2m.toMarkdownString(mdBlocks).parent

    if (mdString) {
      // literal "\n" → actual newlines
      mdString = mdString.replace(/\\n/g, '\n')
      // collapse 3+ newlines → 2
      mdString = mdString.replace(/\n{3,}/g, '\n\n').replaceAll('\\n\\n', '\n\n')

      // async-replace all Notion links, unpacking (fullMatch, linkText, pageId)
      if (replaceNotionLinks) {
        mdString = await replaceAsync(mdString, /\[([^\]]+)\]\(https?:\/\/(?:www\.)?notion\.so\/(?:[^\s/()]+-)?([0-9A-Fa-f]{32})(?:\S*)?\)/g, async ([full, text, pageId]): Promise<string> => {
          let resource: Resource | null = null

          for (const type of resourceTypes) {
            const item = await resourceStorage.getItem<Resource>(`${type}:${pageId}`)

            if (item) {
              resource = item
              break
            }
          }

          if (!resource) return text
          const { type, record } = resource

          switch (type) {
            case 'project':
            case 'content': {
              if (!('Type' in record.properties)) return full

              const title = record.properties['Name'].title.map((t: { plain_text: string }) => t.plain_text).join('')
              const contentType = record.properties['Type']?.select?.name.toLowerCase()
              return `[${text}](/${contentType}/${slugify(title)}_${record.id})`
            }
            case 'client':
            case 'model':
            case 'studio': {
              const url = ('Website' in record.properties ? record.properties.Website.url : null) ?? ('Instagram' in record.properties ? record.properties.Instagram.url : null)
              if (!url) return full

              return `[${text}](${url})`
            }
            default:
              break
          }

          return full
        })
      }

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

      const content = (await notion.pages.retrieve({ page_id: pageId })) as unknown as NotionContent
      if (!content || content.properties.Status.status.name !== 'Publish') {
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      const id = content.id
      const markdown = await convertNotionPageToMarkdown(n2m, id, true)
      const title = notionTitleStringify(content.properties.Name.title)

      return {
        id,
        title,
        cover: content.cover?.type === 'external' ? content.cover.external.url.split('/')[3] : null,
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
