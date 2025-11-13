import type { NotionToMarkdown } from 'notion-to-md'
import { createRegExp, exactly, charNotIn, charIn, maybe, global } from 'magic-regexp'

export default async function (n2m: NotionToMarkdown, pageId: string, replaceNotionLinks: boolean = false) {
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

                // console.log({ text, title: slugify(title), full: `[${text}](/${contentType}/${slugify(title)}_${record.id})` })
                return `[${text}](/${contentType}/${slugify(title)}_${record.id})`
              }
              case 'client': {
                const url = ('Website' in record.properties ? record.properties.Website.url : null) ?? ('Instagram' in record.properties ? record.properties.Instagram.url : null)
                if (!url) return full

                // console.log({ text, url, full: `[${text}](${url})` })
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
