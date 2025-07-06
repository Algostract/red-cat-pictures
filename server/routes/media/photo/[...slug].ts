import { z } from 'zod'

export default defineCachedEventHandler(
  async (event) => {
    try {
      const { slug } = await getValidatedRouterParams(
        event,
        z.object({
          slug: z.string().min(1),
        }).parse
      )

      return slug
    } catch (error) {
      console.error('Route photo GET', error)

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
