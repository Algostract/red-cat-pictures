import { postFacebook } from './send.post'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<FacebookPost>(event)

    return { success: await postFacebook([body]) }
  } catch (error: unknown) {
    console.error('API subscription/facebook POST', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
