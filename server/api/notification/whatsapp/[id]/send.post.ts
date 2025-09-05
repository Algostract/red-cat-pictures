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
    // const { id } = getRouterParams(event)
    const body = await readBody<WhatsappMessage>(event)

    await sendWhatsappMessage([body])

    return { success: true }
  } catch (error: unknown) {
    console.error('API notification/whatsapp/[id]/send POST', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
