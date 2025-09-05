export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)
    const pushStorage = useStorage<PushNotificationSubscription>('data:subscription:notification')

    const result = await pushStorage.removeItem(id)

    return { success: result }
  } catch (error: unknown) {
    console.error('API notification/push/[id]/unsubscribe DELETE', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
