export default defineEventHandler(async (event) => {
  try {
    const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')

    const body = await readBody<WhatsappSubscription>(event)

    if (await whatsappStorage.getItem(body.phone)) {
      return { success: true }
    }

    await whatsappStorage.setItem(body.phone, body)

    return { success: true }
  } catch (error: unknown) {
    console.error('API notification/whatsapp/subscribe POST', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
