import { fromHtml } from 'hast-util-from-html'
import { select } from 'hast-util-select'

export default defineCachedEventHandler(
  async (event) => {
    try {
      const { url } = getQuery(event)
      if (!url || typeof url !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Missing `url` parameter' })
      }

      let html: string
      try {
        html = await $fetch<string>(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
          },
        })
      } catch (err) {
        throw createError({ statusCode: 502, statusMessage: 'Failed to fetch target URL', data: err })
      }

      const tree = fromHtml(html)

      const titleNode = select('meta[property="og:title"]', tree)
      const descNode = select('meta[property="og:description"]', tree)
      const imgNode = select('meta[property="og:image"]', tree)

      const ogTitle = titleNode?.properties?.content ?? null
      const ogDescription = descNode?.properties?.content ?? null
      const ogImage = imgNode?.properties?.content ?? null

      return { ogTitle, ogDescription, ogImage }
    } catch (error: unknown) {
      console.error('API og GET', error)

      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 * 24 * 7 }
)
