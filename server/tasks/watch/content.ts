import { pushNotification } from '~~/server/api/notification/push.post'
import type { Content } from '~~/shared/types'

export default defineTask({
  meta: {
    name: 'watch:content',
    description: 'Fetch content, detect content, trigger notification and newsletter',
  },
  async run() {
    for (const contentType of ['episode', 'blog']) {
      const contentStorage = useStorage<string>(`data:${contentType}`)
      const notificationStorage = useStorage<PushSubscription>('data:notification:subscription')

      const oldContents = await contentStorage.getKeys()
      const allContents = await $fetch<Content[]>(`/api/${contentType}`)
      const newContents = allContents.filter((content) => !oldContents.includes(content.id))

      let subscriptions: PushSubscription[] = []
      if (newContents.length > 0) subscriptions = (await Promise.all((await notificationStorage.getKeys()).map((key) => notificationStorage.getItem(key)))).filter((item) => item !== null)

      newContents.forEach(async ({ id, title, description, url }) => {
        console.log('Processing new content →', title)
        await pushNotification({ title: 'New Episode Release | ' + title, body: `${description.split('. ')[0]}...`, url }, subscriptions)
        await contentStorage.setItem(id, title)
      })
    }

    return { result: 'success' }
  },
})
