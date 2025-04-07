export default defineCachedEventHandler<Promise<Price>>(
  async () => {
    try {
      const prices = (await readYamlFile('prices.yml')) as unknown as Price

      if (!prices) throw createError({ statusCode: 500, statusMessage: 'prices is undefined' })

      return prices
    } catch (error: unknown) {
      console.error('API price GET', error)

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
