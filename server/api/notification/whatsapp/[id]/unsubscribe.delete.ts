export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)
    const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')

    const result = await whatsappStorage.removeItem(id)

    return { success: result }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('API notification/whatsapp/[id]/unsubscribe POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
