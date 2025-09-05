export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)
    const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')

    const result = await whatsappStorage.removeItem(id)

    return { success: result }
  } catch (error: unknown) {
    console.error('API notification/whatsapp/[id]/unsubscribe POST', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
