import WAWebJS from 'whatsapp-web.js'

interface WhatsappMessage {
  to: string
  data: { asset: string; text: string }
}

export async function sendWhatsappMessage(payload: WhatsappMessage[]): Promise<boolean> {
  try {
    if (!whatsapp) {
      throw Error('whatsapp client is not initialized')
    }

    await Promise.allSettled(
      payload.map(async (item) => {
        const wid = `${item.to.replace(/^\+/, '')}@s.whatsapp.net`
        if (item.data.asset) {
          const media = await WAWebJS.MessageMedia.fromUrl(item.data.asset, { unsafeMime: true })
          await whatsapp.sendMessage(wid, media, { caption: item.data.text })
        } else {
          await whatsapp.sendMessage(wid, item.data.text)
        }
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
    const config = useRuntimeConfig()
    const authHeader = getRequestHeader(event, 'authorization')

    if (extractBearerToken(authHeader) !== config.private.serverValidationKey) {
      throw createError({
        statusCode: 400,
        statusMessage: "Server Validation Key does't match",
      })
    }

    const body = await readBody<WhatsappMessage>(event)
    // const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')
    // const subscriptions = (await whatsappStorage.getItems(await whatsappStorage.getKeys())).flatMap(({ value }) => value)

    await sendWhatsappMessage([body])

    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('API subscription/[id]/whatsapp POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
