import { NotionToMarkdown } from 'notion-to-md'
import { convertNotionPageToMarkdown } from '~~/server/api/[content]/[...slug].get'
import { sendPushNotification } from '~~/server/api/notification/push/[id]/send.post'
import { sendEmail } from '~~/server/api/notification/email/[id]/send.post'
import { sendWhatsappMessage } from '~~/server/api/notification/whatsapp/[id]/send.post'

async function facebookPost(image: string, title: string, description: string, url: string) {
  try {
    const { facebookAccessToken, pageId } = useRuntimeConfig().private

    if (!facebookAccessToken || !pageId) {
      throw new Error('Facebook access token or page ID is missing in environment variables')
    }

    const caption = `${title}\n\n${description}\n\nRead more: https://redcatpictures.com${url}`
    const body = new FormData()
    body.append('url', image)
    body.append('caption', caption)
    body.append('access_token', facebookAccessToken)

    const response = await $fetch(`https://graph.facebook.com/v18.0/${pageId}/photos`, {
      method: 'POST',
      body,
    })
    return response
  } catch (error) {
    console.warn('Error posting to Facebook:', error)
    throw error
  }
}

let n2m: NotionToMarkdown

export default defineTask({
  meta: {
    name: 'notify:content',
    description: 'Monitor new episodes and blog posts; send alerts via push, email, whatsApp',
  },
  async run() {
    const resourceStorage = useStorage<Resource>(`data:resource`)
    const subscriptionStorage = useStorage('data:subscription')

    n2m = n2m ?? new NotionToMarkdown({ notionClient: notion })
    let pushNotificationSubscriptions: PushNotificationSubscription[] = []
    let emailSubscriptions: EmailSubscription[] = []
    let whatsappSubscriptions: WhatsappSubscription[] = []

    await Promise.allSettled(
      (await resourceStorage.getItems<Resource<'asset' | 'content'>>([...(await resourceStorage.getKeys('content')), ...(await resourceStorage.getKeys('asset'))])).map(async ({ value: content }) => {
        if (!content || content.notificationStatus == true) return
        if (content.record.properties.Status.status.name !== 'Publish') return

        if (!(pushNotificationSubscriptions.length > 0))
          pushNotificationSubscriptions = (await subscriptionStorage.getItems<NotificationSubscription>(await subscriptionStorage.getKeys('notification'))).flatMap(({ value }) => value)
        if (!(emailSubscriptions.length > 0)) emailSubscriptions = (await subscriptionStorage.getItems<EmailSubscription>(await subscriptionStorage.getKeys('email'))).flatMap(({ value }) => value)
        if (!(whatsappSubscriptions.length > 0))
          whatsappSubscriptions = (await subscriptionStorage.getItems<WhatsappSubscription>(await subscriptionStorage.getKeys('whatsapp'))).flatMap(({ value }) => value)

        const id = content.record.id
        const title = notionTextStringify(content.record.properties.Name.title)
        const markdown = await convertNotionPageToMarkdown(n2m, id)
        const contentType = content.record.properties['Type'].select?.name
        const description = `${mdToText(markdown.split('. ').splice(0, 2).join('. '))}...`
        const url = `/${contentType}/${slugify(title)}_${id}`
        const image =
          content.record.cover?.type === 'external'
            ? `https://ucarecdn.com/${content.record.cover.external.url.split('/')[3]}/-/format/jpg/-/scale_crop/1200x630/center/`
            : 'https://ucarecdn.com/771d0695-2196-4c98-b9eb-4f29acd6506f/-/format/jpg/-/scale_crop/1200x630/center/'

        console.log(`Publishing new ${contentType} content →`, title)

        if (contentType === 'Episode' || contentType === 'Blog' || contentType === 'Photo' || contentType === 'Video')
          await sendPushNotification({ title: `New ${contentType} release | ${title}`, body: `${description.split('. ')[0]}...`, url: url + '?ref=push' }, pushNotificationSubscriptions)
        try {
          if (contentType === 'Episode' || contentType === 'Blog')
            await sendEmail(
              'content',
              emailSubscriptions.map(({ name, email }) => ({
                toPersonName: name,
                toEmail: email,
                emailSubject: `New ${contentType} release | ${title}`,
                contentTitle: `${description.split('. ')[0]}...`,
                contentImage: image,
                contentUrl: 'https://redcatpictures.com' + url,
              }))
            )
        } catch (e) {
          console.warn(e)
        }
        if (contentType === 'Episode') {
          await facebookPost(image, title, description, url)
          console.log('Facebook post sent')

          await sendWhatsappMessage(
            whatsappSubscriptions.map(({ phone }) => ({
              to: phone,
              data: {
                asset: image,
                text: `New ${contentType} release | ${title}\n\n${description.split('. ')[0]}...\n\nRead More here https://redcatpictures.com${url}?ref=whatsapp`,
              },
            }))
          )
        }
        content.notificationStatus = true
        await resourceStorage.setItem(`${content.type}/${normalizeNotionId(id)}`, content)
      })
    )

    return { result: 'success' }
  },
})
