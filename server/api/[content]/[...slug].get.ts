import { NotionToMarkdown } from 'notion-to-md'
import { z } from 'zod'

let n2m: NotionToMarkdown

export default defineCachedEventHandler<Promise<ContentDetails>>(
  async (event) => {
    try {
      const { content: contentType, slug } = await getValidatedRouterParams(
        event,
        z.object({
          content: z.enum(['episode', 'blog']),
          slug: z.string().min(1),
        }).parse
      )

      n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })

      const [name, _ext] = slug.split('.')
      const pageId = name?.split('_').at(-1)

      if (!(pageId && z.uuid().safeParse(pageId).success)) {
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      const content = (await notion.pages.retrieve({ page_id: pageId })) as unknown as NotionContent
      if (!content || !(content.properties.Status.status.name === 'Publish')) {
        throw createError({ statusCode: 404, statusMessage: `pageId ${slug} not found` })
      }

      const id = content.id
      const markdown = await convertNotionPageToMarkdown(n2m, id, true)
      const title = notionTextStringify(content.properties.Name.title)

      return {
        id,
        title,
        cover: content.cover?.type === 'external' ? content.cover.external.url : undefined,
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
  { maxAge: 60 * 60, swr: true }
)
