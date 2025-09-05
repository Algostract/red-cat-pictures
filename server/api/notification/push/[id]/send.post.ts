import webpush from 'web-push'

interface PushNotification {
  title: string
  body: string
  url: string
  icon?: string
}

export async function sendPushNotification(payload: PushNotification, subscriptions: PushNotificationSubscription[]) {
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
    const { id } = getRouterParams(event)
    const body = await readBody<PushNotification>(event)
    const notificationStorage = useStorage<PushNotificationSubscription>('data:subscription:notification')

    const subscription = (await notificationStorage.getItems(await notificationStorage.getKeys())).flatMap(({ value }) => value).filter(({ keys }) => keys.auth === id)
    await sendPushNotification(body, subscription)

    return { success: true }
  } catch (error: unknown) {
    console.error('API notification/push/[id]/send POST', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
