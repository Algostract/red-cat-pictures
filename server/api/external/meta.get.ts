export default defineEventHandler(async (event) => {
  try {
    const { url } = getQuery(event)
    if (!url || typeof url !== 'string') {
      throw createError({ statusCode: 400, statusMessage: 'Missing `url` parameter' })
    }

    const metaDataStorage = useStorage<MetaData>('data:meta-data')

    let data = await metaDataStorage.get(normalizeUrl(url))

    if (!data) {
      const { result } = await runTask<PromiseSettledResult<MetaData>[]>('sync:meta-data', { payload: { urls: [url] } })
      if (!result) {
        throw createError({ statusCode: 400, statusMessage: 'Result is empty' })
      }
      data = result[0].status == 'fulfilled' ? result[0].value : { ogTitle: null, ogDescription: null, ogImage: null, logo: null }
    }

    return data
  } catch (error: unknown) {
    console.error('API external/meta GET', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
