import emailTemplate from '~~/server/emails'
import type { EmailMetaData, EmailTemplateData } from '~~/server/emails'

export interface TransactionalEmail<T extends keyof EmailTemplateData> {
  template: T
  data: EmailTemplateData[T]
}

export async function sendEmail<T extends keyof EmailTemplateData>(template: T, payload: EmailTemplateData[T][]) {
  let isSuccessful = true
  const config = useRuntimeConfig()
  const metaData = config.private.emailMetaData as unknown as EmailMetaData

  await Promise.allSettled(
    payload.map(async (payloadData) => {
      try {
        const allData = { ...metaData, ...emailTemplate[template].data, ...payloadData }
        console.log(allData)
        /* 
 
         const html = await render(emailTemplate[template].template as Component, allData)
         const text = await render(emailTemplate[template].template as Component, allData, { plainText: true })
 
         await transport.verify()
 
         await transport.sendMail({
           from: `"${allData.fromCompanyName}" <${allData.fromEmail}>`,
           to: allData.toEmail,
           subject: allData.emailSubject,
           html,
           text,
         }) */
      } catch (error) {
        console.error('function sendEmail', error)
        isSuccessful = false
      }
    })
  )

  return isSuccessful
}

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
