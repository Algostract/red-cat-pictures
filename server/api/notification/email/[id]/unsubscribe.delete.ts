export default defineEventHandler(async (event) => {
  try {
    const { id } = getRouterParams(event)
    const emailStorage = useStorage<EmailSubscription>('data:subscription:email')

    const result = await emailStorage.removeItem(id)

    return { success: result }
  } catch (error: unknown) {
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    console.error('API notification/email/[id]/unsubscribe DELETE', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
