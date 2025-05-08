import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import { convertNotionPageToMarkdown } from '~~/server/api/[content]/[...slug].get'
import { pushNotification } from '~~/server/api/notification/push.post'

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
    const notificationStorage = useStorage<PushSubscription>('data:notification:subscription')

    notion = notion ?? new Client({ auth: config.private.notionApiKey })
    n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })
    let subscriptions: PushSubscription[] = []

    await Promise.allSettled(
      (await contentStorage.getItems(await contentStorage.getKeys())).map(async ({ value: content }) => {
        if (!content || content.notificationStatus == true) return
        if (content.record.properties.Status.status.name !== 'Publish') return

        if (!(subscriptions.length > 0)) subscriptions = (await notificationStorage.getItems(await notificationStorage.getKeys())).flatMap(({ value }) => value)

        const id = content.record.id
        const title = content.record.properties['Name'].title.map(({ plain_text }) => plain_text ?? '').join('') as string
        const markdown = await convertNotionPageToMarkdown(n2m, id)
        const contentType = content.record.properties['Type'].select?.name.toLowerCase()
        const description = `${mdToText(markdown.split('. ').splice(0, 2).join('. '))}...`
        const url = `/${contentType}/${slugify(title)}_${id}`

        console.log(`Publishing new ${contentType} content →`, title)
        await pushNotification({ title: `New ${contentType} release | ${title}`, body: `${description.split('. ')[0]}...`, url }, subscriptions)
        // await sendEmail()

        content.notificationStatus = true
        await contentStorage.setItem(normalizeNotionId(id), content)
      })
    )

    return { result: 'success' }
  },
})
