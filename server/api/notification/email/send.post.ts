import type { EmailTemplateData } from '~~/server/emails'
import type { TransactionalEmail } from './[id]/send.post'
import { sendEmail } from './[id]/send.post'

export default defineEventHandler<Promise<{ success: boolean }>>(async (event) => {
  try {
    // const { id } = getRouterParams(event)
    const body = await readBody<TransactionalEmail<keyof EmailTemplateData>>(event)
    await sendEmail(body.template, [body.data])

    return { success: true }
  } catch (error: unknown) {
    console.error('API notification/email/[id]/send POST', error)

    const { code: errorCode } = error as { code?: string }
    if (errorCode === 'ESOCKET' || errorCode === 'ECONNECTION') {
      throw createError({ statusCode: 500, statusMessage: 'Failed to establish secure SMTP connection. Please check SSL/TLS settings.' })
    }

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
