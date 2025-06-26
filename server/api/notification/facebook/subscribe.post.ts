interface FacebookMessage {
  to: string
  data: { asset: string; text: string }
}

export async function postFacebookGroup(payload: FacebookMessage[]): Promise<boolean> {
  try {
    const config = useRuntimeConfig()

    await Promise.allSettled(
      payload.map(async (item) => {
        const formdata = new FormData()
        formdata.append('source', item.data.asset)
        // formdata.append("caption", item.data.text);
        formdata.append('message', item.data.text)
        formdata.append('access_token', config.private.facebookAccessToken)

        // Timeline Post
        /*     const result = await $fetch(`/${247210895150869}/photos`, {
              baseURL: 'https://graph.facebook.com/v23.0',
              method: 'POST',
              body: formdata,
            }) */

        const result = await $fetch(`https://graph.facebook.com/v23.0/${item.to}/photos`, {
          method: 'POST',
          body: formdata,
        })

        console.log({ result })
      })
    )

    return true
  } catch (error) {
    console.error('function sendWhatsappMessage', error)
    return false
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<FacebookMessage>(event)

    await postFacebookGroup([body])

    return { success: true }
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
