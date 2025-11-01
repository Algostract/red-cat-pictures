import puppeteer from 'puppeteer'
import { unified } from 'unified'
import type { Nodes } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { select } from 'hast-util-select'
import rehypeRemark from 'rehype-remark'
import remarkStringify from 'remark-stringify'
import rehypeParse from 'rehype-parse'

export async function scrapeData(url: string, format: 'html' | 'tree' | 'markdown', engine: 'fetch' | 'browser' = 'fetch') {
  // 1. Fetch raw HTML
  let html = ''

  if (engine === 'browser') {
    const browser = await puppeteer.launch(
      import.meta.env.NODE_ENV === 'production'
        ? {
            browserWSEndpoint: import.meta.env.BROWSER_ENDPOINT,
            args: ['--no-sandbox', '--disable-dev-shm-usage'],
          }
        : {
            headless: true,
          }
    )
    try {
      const page = await browser.newPage()
      await page.setViewport({ width: 1280, height: 960 })
      await page.goto(url, { waitUntil: 'networkidle2' })

      // Scroll to the bottom of the page to load dynamic content
      let previousHeight = await page.evaluate('document.body.scrollHeight')
      while (true) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
        await page.waitForNetworkIdle() // Wait for content to load
        const newHeight = await page.evaluate('document.body.scrollHeight')
        if (newHeight === previousHeight) {
          break
        }
        previousHeight = newHeight
      }
      await page.waitForNetworkIdle()
      html = await page.content()
    } catch {
      console.error('Error in scrapeData', { url })
    } finally {
      await browser.close()
    }
  } else {
    html = await $fetch<string>(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' + '(KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
      },
    })
  }

  if (!html) return html

  // 2. Return raw HTML if requested
  if (format === 'html') {
    return html
  }
  // 3. Parse into your Nodes tree for both 'tree' and 'markdown'
  else if (format === 'tree') {
    // Just hand back the tree via callback
    return fromHtml(html)
  } else if (format === 'markdown') {
    // Convert HTML->HAST->MDAST->Markdown string
    const content = await unified()
      .use(rehypeParse, { fragment: true }) // Parses HTML into HAST
      .use(rehypeRemark) // Transforms HAST to MDAST
      .use(remarkStringify) // Serializes MDAST to Markdown
      .process(html)
      .then((file) => String(file))

    return content
  }

  // Should never reach here
  throw new Error(`Unknown format: ${format}`)
}

function extractOgData(
  tree: Nodes,
  baseUrl: string
): {
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  logo: string | null
} {
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
    ogImage: image as string,
    logo,
  }
}

export default defineTask({
  meta: {
    name: 'sync:meta-data',
    description: 'Process an array of URLs; retrieve and return each page’s OG title, description, and image',
  },
  async run({ payload }) {
    // console.log("Task sync:meta-data running")
    const metaDataStorage = useStorage<MetaData>('data:meta-data')
    const resourceStorage = useStorage<Resource>(`data:resource`)

    const urls = (payload.urls ?? []) as unknown as string[]
    const source = (payload.source ?? 'auto') as unknown as 'internal' | 'external' | 'auto'

    // if payload is empty get all the links of clients, models, studios, contents
    const result = await Promise.allSettled(
      urls.map(async (url) => {
        const data = (await metaDataStorage.getItem(normalizeUrl(url))) ?? {
          ogTitle: null,
          ogDescription: null,
          ogImage: null,
          logo: null,
          lastUpdated: new Date().toISOString(),
        }
        data.lastUpdated = new Date().toISOString()
        await metaDataStorage.setItem(normalizeUrl(url), data)

        let resource: Resource | null = null
        if (source !== 'external') {
          const keys = await resourceStorage.getKeys()
          const items = await resourceStorage.getItems<Resource>(keys)
          for (const { value } of items) {
            const props = value.record.properties

            if ('Type' in props && props.Type?.select?.name) {
              const type = props.Type.select.name.toLowerCase()
              const title = notionTextStringify(props.Name.title)
              const pattern = `/${type}/${slugify(title)}_${value.record.id}`
              if (url.includes(pattern)) resource = value
            }

            const link = ('Website' in props && props.Website?.url) || ('Instagram' in props && props.Instagram?.url) || null
            if (link && url.includes(link)) resource = value
          }
        }

        if (resource) {
          Object.assign(data, {
            ogTitle: resource.record.properties.Name.title.map((title) => (typeof title !== 'string' ? title.plain_text : '')).join('') || null,
            ogDescription: null,
            ogImage: resource.record.cover?.type === 'external' ? resource.record.cover.external.url : undefined,
            logo: resource.record.icon?.type === 'external' ? resource.record.icon.external.url : undefined,
          })

          if (source === 'auto') {
            const tree = await scrapeData(url, 'tree')
            const ext = extractOgData(tree, url)
            data.ogTitle ??= ext.ogTitle
            data.ogDescription ??= ext.ogDescription
            data.ogImage ??= ext.ogImage as string
            data.logo ??= ext.logo
          }
        } else {
          const tree = await scrapeData(url, 'tree')
          const ext = extractOgData(tree, url)
          Object.assign(data, ext)
        }

        data.lastUpdated = new Date().toISOString()

        await metaDataStorage.setItem(normalizeUrl(url), data)
        return data
      })
    )

    return { result }
  },
})
