export default defineEventHandler<Promise<Price>>(async () => {
  try {
    const prices = (await readYamlFile('prices.yml')) as unknown as Price

    if (!prices) throw createError({ statusCode: 500, statusMessage: 'prices is undefined' })

    return prices
  } catch (error: unknown) {
    console.error('API price GET', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
