import webpush from 'web-push'

interface PushNotification {
  title: string
  body: string
  url: string
  icon?: string
}

export async function sendPushNotification(payload: PushNotification, subscriptions: NotificationSubscription[]) {
  try {
    const config = useRuntimeConfig()

    webpush.setVapidDetails(config.private.vapidSubject, config.public.vapidKey, config.private.vapidKey)

    await Promise.allSettled(subscriptions.map((sub) => webpush.sendNotification(sub, JSON.stringify(payload))))

    return true
  } catch (error) {
    console.error('function sendPushNotification', error)
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

    const body = await readBody<PushNotification>(event)
    const notificationStorage = useStorage<NotificationSubscription>('data:subscription:notification')

    const subscriptions = (await notificationStorage.getItems(await notificationStorage.getKeys())).flatMap(({ value }) => value)
    await sendPushNotification(body, subscriptions)

    return { success: true }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('API subscription/[id]/notification POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
