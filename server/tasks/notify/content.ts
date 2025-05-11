import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { convertNotionPageToMarkdown } from '~~/server/api/[content]/[...slug].get'
import { sendEmail } from '~~/server/api/subscription/[id]/email.post'
import { pushNotification } from '~~/server/api/subscription/[id]/notification.post'

let notion: Client
let n2m: NotionToMarkdown

export default defineTask({
  meta: {
    name: 'notify:content',
    description: 'Monitor new episodes and blog posts; send alerts via push, email, whatsApp',
  },
  async run() {
    const config = useRuntimeConfig()
    const contentStorage = useStorage<Resource<'content'>>(`data:resource:content`)
    const subscriptionStorage = useStorage('data:subscription:')

    notion = notion ?? new Client({ auth: config.private.notionApiKey })
    n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })
    let notificationSubscriptions: NotificationSubscription[] = []
    let emailSubscriptions: EmailSubscription[] = []

    await Promise.allSettled(
      (await contentStorage.getItems(await contentStorage.getKeys())).map(async ({ value: content }) => {
        if (!content || content.notificationStatus == true) return
        if (content.record.properties.Status.status.name !== 'Publish') return

        if (!(notificationSubscriptions.length > 0))
          notificationSubscriptions = (await subscriptionStorage.getItems<NotificationSubscription>(await subscriptionStorage.getKeys('notification'))).flatMap(({ value }) => value)
        if (!(emailSubscriptions.length > 0)) emailSubscriptions = (await subscriptionStorage.getItems<EmailSubscription>(await subscriptionStorage.getKeys('email'))).flatMap(({ value }) => value)

        const id = content.record.id
        const title = content.record.properties['Name'].title.map(({ plain_text }) => plain_text ?? '').join('') as string
        const markdown = await convertNotionPageToMarkdown(n2m, id)
        const contentType = content.record.properties['Type'].select?.name.toLowerCase()
        const description = `${mdToText(markdown.split('. ').splice(0, 2).join('. '))}...`
        const url = `/${contentType}/${slugify(title)}_${id}`

        console.log(`Publishing new ${contentType} content →`, title)
        await pushNotification({ title: `New ${contentType} release | ${title}`, body: `${description.split('. ')[0]}...`, url }, notificationSubscriptions)
        await sendEmail(
          'content',
          emailSubscriptions.map(({ name, email }) => ({
            toPersonName: name,
            toEmail: email,
          }))
        )

        content.notificationStatus = true
        await contentStorage.setItem(normalizeNotionId(id), content)
      })
    )

    return { result: 'success' }
  },
})
