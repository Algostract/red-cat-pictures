import { NotionToMarkdown } from 'notion-to-md'
import { createRegExp, exactly, charNotIn, charIn, maybe, global } from 'magic-regexp'
import { z } from 'zod'

let n2m: NotionToMarkdown

export async function convertNotionPageToMarkdown(n2m: NotionToMarkdown, pageId: string, replaceNotionLinks: boolean = false) {
  try {
    const resourceStorage = useStorage<Resource>(`data:resource`)
    const mdBlocks = await n2m.pageToMarkdown(pageId)
    let mdString = n2m.toMarkdownString(mdBlocks).parent

    if (mdString) {
      mdString = mdString.replace(createRegExp(exactly('\n').times(3).or(exactly('\\n').times(2)), [global]), '\n\n')

      if (replaceNotionLinks) {
        mdString = await replaceAsync(
          mdString,
          createRegExp(
            exactly('[')
              .and(charNotIn(']').times.any().as('text'))
              .and(']')
              .and('(')
              .and(
                exactly('http')
                  .and(maybe('s'))
                  .and('://')
                  .and(maybe('www.'))
                  .and('notion.so/')
                  .and(maybe(charNotIn(' /()').times.any().and('-')))
                  .and(charIn('0-9a-fA-F').times(32).as('pageId'))
                  .and(maybe(charNotIn(')').times.any()))
                  .as('url')
              )
              .and(')'),
            [global]
          ),
          async ([full, text, pageId]): Promise<string> => {
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
              // case 'project':
              case 'content': {
                if (!('Type' in record.properties)) return full

                const title = notionTextStringify(record.properties['Name'].title)
                const contentType = record.properties.Type?.select.name.toLowerCase()

                console.log({ text, title: slugify(title), full: `[${text}](/${contentType}/${slugify(title)}_${record.id})` })
                return `[${text}](/${contentType}/${slugify(title)}_${record.id})`
              }
              case 'client': {
                const url = ('Website' in record.properties ? record.properties.Website.url : null) ?? ('Instagram' in record.properties ? record.properties.Instagram.url : null)
                if (!url) return full

                console.log({ text, url, full: `[${text}](${url})` })
                return `[${text}](${url})`
              }
              default:
                break
            }

            return full
          }
        )

        mdString = mdString.replace(
          createRegExp(exactly('\n\nchild_database\n\n'), [global]),
          await (async () => {
            const currentContent = await resourceStorage.getItem<Resource<'content'>>(`content:${normalizeNotionId(pageId)}`)
            const currentAssets = await resourceStorage.getItems<Resource<'asset'>>(currentContent?.record.properties.Asset.relation.flatMap(({ id }) => `asset:${normalizeNotionId(id)}`) ?? [])

            return `\n::gallery{photos="${currentAssets.flatMap(({ value }) => value.record.properties.Slug.formula.string).join(',')}"}\n::\n`
          })()
        )
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

      if (!pageId) {
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
        cover: content.cover?.type === 'external' ? content.cover.external.url.split('/')[3] : undefined,
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
