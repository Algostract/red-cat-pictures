import { Client } from '@notionhq/client'
import { sendEmail } from '~~/server/api/subscription/[id]/email.post'

let notion: Client

export default defineTask({
  meta: {
    name: 'prospect:marketing',
    description: 'Outreach agencies via email, instagram, whatsApp',
  },
  async run() {
    const config = useRuntimeConfig()
    if (!config.private.notionApiKey) {
      throw new Error('Notion API Key Not Found')
    }

    const prospectStorage = useStorage<Resource<'prospect'>>(`data:resource:prospect`)

    await Promise.allSettled(
      (await prospectStorage.getItems(await prospectStorage.getKeys())).map(async ({ value: prospect }) => {
        const id = prospect.record.id
        const companyName = prospect.record.properties.Name.title.map(({ plain_text }) => plain_text ?? '').join('')
        const email = prospect.record.properties.Email.email
        const status = prospect.record.properties.Status.status.name

        if (!(email && status === 'Verified')) return

        notion = notion ?? new Client({ auth: config.private.notionApiKey })

        console.log(`Sending new marketing email →`, companyName)
        await sendEmail('prospect', [
          {
            toEmail: email,
            toCompanyName: companyName,
            toPersonName: companyName,
          },
        ])

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
