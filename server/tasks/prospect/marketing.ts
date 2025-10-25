import { sendEmail } from '~~/server/api/notification/email/[id]/send.post'
import { sendWhatsappMessage } from '~~/server/api/notification/whatsapp/[id]/send.post'
import { messageTemplates } from '~~/server/plugins/whatsapp'

export default defineTask({
  meta: {
    name: 'prospect:marketing',
    description: 'Outreach agencies via email, instagram, whatsApp',
  },
  async run() {
    const {
      public: { cdnUrl },
    } = useRuntimeConfig()
    const prospectStorage = useStorage<Resource<'prospect'>>(`data:resource:prospect`)
    const emailStorage = useStorage<EmailSubscription>('data:subscription:email')
    const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')

    await Promise.allSettled(
      (await prospectStorage.getItems(await prospectStorage.getKeys())).map(async ({ value: prospect }) => {
        const prospectId = prospect.record.id
        const companyName = notionTextStringify(prospect.record.properties.Name.title)
        const email = prospect.record.properties.Email.email
        const whatsapp = prospect.record.properties.Whatsapp.url?.replace(/^https?:\/\/wa\.me\//, '')
        const status = prospect.record.properties.Status.status.name

        if (!(status === 'Verified')) return

        if (email) {
          console.log(`Sending new marketing email →`, companyName)

          await sendEmail('prospect', [
            {
              toEmail: email,
              toCompanyName: companyName,
              toPersonName: companyName,
            },
          ])
          // Subscribe to Email Notification
          await emailStorage.setItem(email, {
            name: companyName,
            email,
          })
        }

        if (whatsapp) {
          console.log(`Sending new marketing whatsapp →`, companyName)

          await sendWhatsappMessage([
            {
              to: whatsapp,
              data: {
                asset: '',
                text: messageTemplates.prospectStart,
              },
            },
          ])
          await Promise.allSettled(
            messageTemplates.prospectMiddle.map(async (key) => {
              try {
                const data = await $fetch(`/api/photo/${(key as unknown as string).toLowerCase()}`)
                if (Array.isArray(data)) throw new Error('Unexpected array response')

                const link = `${cdnUrl}/${extractCdnId(data.image)}/-/format/jpg/-/preview/${Math.min(1080, Math.round(1080 * data.aspectRatio))}x${Math.min(1080, Math.round(1080 / data.aspectRatio))}/`

                await sendWhatsappMessage([
                  {
                    to: whatsapp,
                    data: {
                      asset: link,
                      text: ``,
                    },
                  },
                ])
              } catch {
                return null
              }
            })
          )
          await sendWhatsappMessage([
            {
              to: whatsapp,
              data: {
                asset: '',
                text: messageTemplates.prospectEnd,
              },
            },
          ])

          // Subscribe to Whatsapp Notification
          await whatsappStorage.setItem(whatsapp, {
            name: companyName,
            phone: whatsapp,
          })
        }

        await notion.pages.update({
          page_id: prospectId,
          properties: {
            Status: {
              status: {
                name: 'Initiate',
              },
            },
          },
        })

        prospect.record.properties.Status.status.name = 'Initiate'
        await prospectStorage.setItem(normalizeNotionId(prospectId), prospect)
      })
    )

    return { result: 'success' }
  },
})
