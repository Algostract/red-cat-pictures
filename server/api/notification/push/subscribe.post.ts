export default defineEventHandler(async (event) => {
  try {
    const notificationStorage = useStorage<PushNotificationSubscription>('data:subscription:notification')

    const body = await readBody<PushNotificationSubscription>(event)

    if (await notificationStorage.getItem(body.keys.auth)) {
      return { success: true }
    }

    await notificationStorage.setItem(body.keys.auth, body)

    return { success: true }
  } catch (error: unknown) {
    console.error('API notification/push/subscribe POST', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
