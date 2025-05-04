import type { Nodes } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { select } from 'hast-util-select'

function extractOgData(tree: Nodes, baseUrl: string) {
  let title = select('meta[property="og:title"]', tree)?.properties?.content || select('title', tree)?.children?.[0]?.value || select('h1', tree)?.children?.[0]?.value || null

  let description =
    select('meta[property="og:description"]', tree)?.properties?.content || select('meta[name="description"]', tree)?.properties?.content || select('article p', tree)?.children?.[0]?.value || null

  let image = select('meta[property="og:image"]', tree)?.properties?.content || select('link[rel="image_src"]', tree)?.properties?.href || select('img', tree)?.properties?.src || null

  const jsonLd = select('script[type="application/ld+json"]', tree)
  if (jsonLd?.children?.[0]?.value) {
    try {
      const data = JSON.parse(jsonLd.children[0].value)
      title = title || data.headline
      description = description || data.description
      image = image || (Array.isArray(data.image) ? data.image[0] : data.image)
    } catch {
      /* empty */
    }
  }

  const rawIcon = select('link[rel="icon"]', tree)?.properties?.href || select('link[rel="shortcut icon"]', tree)?.properties?.href || ''
  const logo = rawIcon ? new URL(rawIcon, baseUrl).href : null

  return {
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    logo,
  }
}

export default defineTask({
  meta: {
    name: 'fetch:meta-data',
    description: 'Process an array of URLs; retrieve and return each page’s OG title, description, and image',
  },
  async run(event) {
    const metaDataStorage = useStorage<MetaData>('data:meta-data')
    const resourceStorage = useStorage<Resource>(`data:resource`)

    const urls = (event.payload.urls ?? []) as unknown as string[]
    const source = (event.payload.source ?? 'auto') as unknown as 'internal' | 'external' | 'auto'

    // if payload is empty get all the links of clients, models, studios, contents
    const result = await Promise.allSettled(
      urls.map(async (url) => {
        const data: {
          ogTitle: string | null
          ogDescription: string | null
          ogImage: string | null
          logo: string | null
        } = {
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
          logo: null,
        }

        let resource: Resource | null = null
        if (source !== 'external') {
          const keys = await resourceStorage.getKeys()
          const items = await resourceStorage.getItems<Resource>(keys)
          for (const { value } of items) {
            const props = value.record.properties

            if ('Type' in props && props.Type?.select?.name) {
              const type = props.Type.select.name.toLowerCase()
              const title = props.Name.title.map((t) => t.plain_text).join('')
              const pattern = `/${type}/${slugify(title)}_${value.record.id}`
              if (url.includes(pattern)) resource = value
            }

            const link = ('Website' in props && props.Website?.url) || ('Instagram' in props && props.Instagram?.url) || null
            if (link && url.includes(link)) resource = value
          }
        }

        const FETCH_HEADERS = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Sec-Fetch-User': '?1',
        }

        if (resource) {
          Object.assign(data, {
            ogTitle: resource.record.properties.Name.title.map((t) => ('plan_text' in t ? t.plan_text : '')).join('') || null,
            ogDescription: null,
            ogImage:
              (resource.record.cover?.type === 'external' ? resource.record.cover.external.url : null) ?? (resource.record.cover?.type === 'file' ? resource.record.cover.file.url : null) ?? null,
            logo: (resource.record.icon?.type === 'external' ? resource.record.icon.external.url : null) ?? (resource.record.icon?.type === 'file' ? resource.record.icon.file.url : null) ?? null,
          })

          if (source === 'auto') {
            const html = await $fetch<string>(url, { headers: FETCH_HEADERS })
            const tree = fromHtml(html)
            const ext = extractOgData(tree, url)
            data.ogTitle ??= ext.ogTitle
            data.ogDescription ??= ext.ogDescription
            data.ogImage ??= ext.ogImage as string
            data.logo ??= ext.logo
          }
        } else {
          const html = await $fetch<string>(url, { headers: FETCH_HEADERS })
          const tree = fromHtml(html)
          Object.assign(data, extractOgData(tree, url))
        }

        await metaDataStorage.setItem(normalizeUrl(url), data)
        return data
      })
    )

    return { result }
  },
})
