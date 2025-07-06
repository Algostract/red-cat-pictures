export default defineCachedEventHandler(
  async (event) => {
    try {
      const { url } = getQuery(event)
      if (!url || typeof url !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Missing `url` parameter' })
      }

      const metaDataStorage = useStorage<MetaData>('data:meta-data')
      let data = await metaDataStorage.get(normalizeUrl(url))

      if (!data) {
        // no cache – run task and wait
        const { result } = await runTask<PromiseSettledResult<MetaData>[]>('sync:meta-data', { payload: { urls: [url] } })
        if (!result) {
          throw createError({ statusCode: 400, statusMessage: 'Result is empty' })
        }
        data = result[0].status === 'fulfilled' ? result[0].value : { ogTitle: null, ogDescription: null, ogImage: null, logo: null, lastUpdated: new Date().toISOString() }
      } else {
        // cache hit – refresh in background
        void runTask<PromiseSettledResult<MetaData>[]>('sync:meta-data', { payload: { urls: [url] } })
      }

      return data
    } catch (error: unknown) {
      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      console.error('API external/meta GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 }
)
