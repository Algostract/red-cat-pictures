import { pushNotification } from '~~/server/api/notification/push.post'

export default defineTask({
  meta: {
    name: 'watch:episode',
    description: 'Fetch episode API, detect episode, trigger notification and newsletter',
  },
  async run() {
    const episodeStorage = useStorage<string>('data:episode')
    const notificationStorage = useStorage<PushSubscription>('data:notification:subscription')

    const oldEpisodes = await episodeStorage.getKeys()
    const allEpisodes = await $fetch('/api/episode')
    const newEpisodes = allEpisodes.filter((episode) => !oldEpisodes.includes(episode.id))

    let subscriptions: PushSubscription[] = []
    if (newEpisodes.length > 0) subscriptions = (await Promise.all((await notificationStorage.getKeys()).map((key) => notificationStorage.getItem(key)))).filter((item) => item !== null)

    newEpisodes.forEach(async ({ id, title, description, url }) => {
      console.log('Processing new episode →', title)
      await pushNotification({ title: 'New Episode Release | ' + title, body: `${description.split('. ')[0]}...`, url }, subscriptions)
      await episodeStorage.setItem(id, title)
    })

    return { result: 'success' }
  },
})
