export interface FacebookPost {
  data: { asset: string; text: string }
}

export async function postFacebook(payload: FacebookPost[]): Promise<boolean> {
  try {
    const config = useRuntimeConfig()

    await Promise.all(
      payload.map(async (item) => {
        const formdata = new FormData()
        formdata.append('url', item.data.asset)
        formdata.append('caption', item.data.text)
        formdata.append('access_token', config.private.facebookAccessToken)

        await $fetch(`/${config.private.facebookPageId}/photos`, {
          baseURL: 'https://graph.facebook.com/v23.0',
          method: 'POST',
          body: formdata,
        })
      })
    )

    return true
  } catch (error) {
    console.error('function postFacebook', error)
    return false
  }
}

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
