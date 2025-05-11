export default defineEventHandler(async (event) => {
  try {
    const notificationStorage = useStorage<EmailSubscription>('data:subscription:email')

    const body = await readBody<EmailSubscription>(event)

    if (await notificationStorage.getItem(body.email)) {
      return { success: true }
    }

    await notificationStorage.setItem(body.email, body)

    return { success: true }
  } catch (error: unknown) {
    console.error('API subscription/email POST', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
