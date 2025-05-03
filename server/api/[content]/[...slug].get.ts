import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { z } from 'zod'
import type { NotionContent, NotionDB, NotionProject, NotionProjectClient } from '~~/server/types'

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
  url: string
  public_url: null
}

export async function convertNotionPageToMarkdown(notion: Client, n2m: NotionToMarkdown, pageId: string, replaceNotionLinks: boolean = false) {
  try {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    const mdBlocks = await n2m.pageToMarkdown(pageId)
    let mdString = n2m.toMarkdownString(mdBlocks).parent

    if (mdString) {
      // literal "\n" → actual newlines
      mdString = mdString.replace(/\\n/g, '\n')
      // collapse 3+ newlines → 2
      mdString = mdString.replace(/\n{3,}/g, '\n\n').replaceAll('\\n\\n', '\n\n')

      // async-replace all Notion links, unpacking (fullMatch, linkText, pageId)
      if (replaceNotionLinks) {
        const tasks = {
          client: notion.databases.query({ database_id: notionDbId.client }) as unknown as NotionProjectClient[],
          project: notion.databases.query({ database_id: notionDbId.project }) as unknown as NotionProject[],
          content: notion.databases.query({ database_id: notionDbId.content }) as unknown as NotionContent[],
          model: notion.databases.query({ database_id: notionDbId.model }) as unknown as NotionResource[],
          studio: notion.databases.query({ database_id: notionDbId.studio }) as unknown as NotionResource[],
        }

        const results = await Promise.allSettled(Object.values(tasks))

        type TaskKey = keyof typeof tasks
        type TaskRecord = NotionProjectClient | NotionProject | NotionContent | NotionResource

        const lookup = new Map<string, { r: TaskRecord; t: TaskKey }>()

        results.forEach((res, idx) => {
          const type = Object.keys(tasks)[idx] as keyof typeof tasks
          if (res.status === 'fulfilled') {
            res.value.results.forEach((r) => lookup.set(r.id.replaceAll('-', ''), { r, t: type }))
          } else {
            console.error(`Notion fetch failed for ${type}:`, res.reason)
          }
        })

        return mdString.replace(/\[([^\]]+)\]\(https?:\/\/(?:www\.)?notion\.so\/(?:[^\s/()]+-)?([0-9A-Fa-f]{32})(?:\S*)?\)/g, (_full, text, pageId) => {
          const entry = lookup.get(pageId)
          if (!entry) return text

          const { r: res, t: type } = entry
          if (type === 'project' || type === 'content') {
            const title = (res.properties as { 'Content name': { title: { plain_text: string }[] } })['Content name'].title.map((t) => t.plain_text).join('')
            const contentType = (res.properties as { 'Content type': { select: { name: string } } })['Content type']?.select?.name.toLowerCase()
            return `[${text}](/${contentType}/${slugify(title)}_${res.id})`
          } else {
            const url = res.properties?.Website?.url || res.properties?.Instagram?.url || '#'
            return `[${text}](${url})`
          }
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
