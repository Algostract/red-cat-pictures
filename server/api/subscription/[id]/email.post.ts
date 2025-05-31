import { Buffer } from 'buffer'
import { render } from '@vue-email/render'
import emailTemplate, { type EmailTemplateData } from '~~/server/emails'

interface TransactionalEmail<T extends keyof EmailTemplateData> {
  template: T
  data: EmailTemplateData[T]
}

function buildRawMessage({ to, from, subject, text, html }: { to: string; from: string; subject: string; text: string; html: string }) {
  const boundary = '====Boundary_' + Date.now()
  const raw =
    `From: ${from}\r\n` +
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: multipart/alternative; boundary="${boundary}"\r\n` +
    `\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: text/plain; charset="UTF-8"\r\n\r\n` +
    `${text}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: text/html; charset="UTF-8"\r\n\r\n` +
    `${html}\r\n` +
    `--${boundary}--`
  return raw
}

function base64UrlEncode(input: string | number | boolean): string {
  return Buffer.from(String(input)).toString('base64url')
}

async function saveAsDraft(rawMessage: string) {
  const body = { message: { raw: base64UrlEncode(rawMessage) } }

  const res = await apiFetch<{ id: string }>('/drafts', {
    baseURL: 'https://gmail.googleapis.com/gmail/v1/users/me',
    method: 'POST',
    body,
  })

  return res
}

export async function sendEmail<T extends keyof EmailTemplateData>(template: T, payload: EmailTemplateData[T][], isDraft = true) {
  try {
    const module = emailTemplate[template] as {
      data(arg: EmailTemplateData[T]): Promise<{
        [key: string]: string
      }>
    }

    await Promise.allSettled(
      payload.map(async (item) => {
        const finalData = await module.data(item)

        const html = await render(emailTemplate[template].template, finalData)
        const text = await render(emailTemplate[template].template, finalData, { plainText: true })

        if (isDraft) {
          // Save to Draft
          const raw = buildRawMessage({
            from: `"${finalData.fromCompanyName}" <${finalData.fromEmail}>`,
            to: finalData.toEmail,
            subject: finalData.emailSubject,
            html,
            text,
          })

          await saveAsDraft(raw)
        } else {
          // Send email Directly
          const { transport } = useNodeMailer()

          await transport.verify()

          await transport.sendMail({
            from: `"${finalData.fromCompanyName}" <${finalData.fromEmail}>`,
            to: finalData.toEmail,
            subject: finalData.emailSubject,
            html,
            text,
          })
        }
      })
    )

    return true
  } catch (error) {
    console.error('function sendEmail', error)
    return false
  }
}

export default defineEventHandler<Promise<{ success: boolean }>>(async (event) => {
  try {
    const config = useRuntimeConfig()
    const authHeader = getRequestHeader(event, 'authorization')

    if (extractBearerToken(authHeader) !== config.private.serverValidationKey) {
      throw createError({
        statusCode: 400,
        statusMessage: "Server Validation Key does't match",
      })
    }

    const body = await readBody<TransactionalEmail<keyof EmailTemplateData>>(event)
    await sendEmail(body.template, [body.data], false)

    return { success: true }
  } catch (error: unknown) {
    console.error('API subscription/[id]/email POST', error)

    const { code: errorCode } = error as { code?: string }
    if (errorCode === 'ESOCKET' || errorCode === 'ECONNECTION') {
      throw createError({ statusCode: 500, statusMessage: 'Failed to establish secure SMTP connection. Please check SSL/TLS settings.' })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
