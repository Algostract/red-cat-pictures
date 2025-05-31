import { sendEmail } from '~~/server/api/subscription/[id]/email.post'
import { sendWhatsappMessage } from '~~/server/api/subscription/[id]/whatsapp.post'
import type { WhatsappSubscription } from '~~/shared/types'

export default defineTask({
  meta: {
    name: 'prospect:marketing',
    description: 'Outreach agencies via email, instagram, whatsApp',
  },
  async run() {
    const prospectStorage = useStorage<Resource<'prospect'>>(`data:resource:prospect`)
    const notificationStorage = useStorage<EmailSubscription>('data:subscription:email')
    const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')

    await Promise.allSettled(
      (await prospectStorage.getItems(await prospectStorage.getKeys())).map(async ({ value: prospect }) => {
        const id = prospect.record.id
        const companyName = notionTextStringify(prospect.record.properties.Name.title)
        const email = prospect.record.properties.Email.email
        const phone = prospect.record.properties.Whatsapp.url.replace(/^https?:\/\/wa\.me\//, '')
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
          await notificationStorage.setItem(email, {
            name: companyName,
            email,
          })
        }

        if (phone) {
          console.log(`Sending new marketing whatsapp →`, companyName)

          await sendWhatsappMessage([
            {
              to: phone,
              data: {
                asset: '',
                text: `Hello ${companyName} Team,
        \nI’m Aratrik Nandy from RED CAT PICTURES. We specialize in product videography and photography—delivering crisp, high‑resolution photos and short‑form videos
        for e‑commerce, social media, and advertising. Whether on‑location or in‑studio, our full production and post‑production services ensure top‑quality assets, on time and within budget. Here are some of our work
        \nWebsite: https://redcatpictures.com?ref=whatsapp`,
              },
            },
          ])
          const links = await Promise.all(
            ['Ecommerce-014-001', 'Product-001-001', 'Ecommerce-012-001', 'Product-028-001', 'Food-003-001', 'Food-019-001', 'Food-004-001', 'Product-016-003'].map(async (key) => {
              try {
                const data = await $fetch(`/api/photo/${(key as unknown as string).toLowerCase()}`)
                if (Array.isArray(data)) throw new Error('Unexpected array response')

                return `https://ucarecdn.com/${data.id}/-/format/jpg/-/preview/${Math.min(1080, Math.round(1080 * data.aspectRatio))}x${Math.min(1080, Math.round(1080 / data.aspectRatio))}/`
              } catch {
                return null
              }
            })
          ).then((photos) => photos.filter((photo) => photo !== null))
          await Promise.allSettled(
            links.map(async (link) => {
              await sendWhatsappMessage([
                {
                  to: phone,
                  data: {
                    asset: link,
                    text: ``,
                  },
                },
              ])
            })
          )
          await sendWhatsappMessage([
            {
              to: phone,
              data: {
                asset: '',
                text: `I would appreciate a brief call to discuss strategies for enhancing your clients' visual marketing campaigns. Please advise on your availability.
        \nThank you for your consideration.`,
              },
            },
          ])

          // Subscribe to Whatsapp Notification
          await whatsappStorage.setItem(phone, {
            name: companyName,
            phone,
          })
        }

        await notion.pages.update({
          page_id: id,
          properties: {
            Status: {
              status: {
                name: 'Initiate',
              },
            },
          },
        })

        await prospectStorage.setItem(normalizeNotionId(id), prospect)
      })
    )

    return { result: 'success' }
  },
})
