type ResourceQueries = {
  [K in ResourceType]: ResourceRecordMap[K][]
}

export default defineTask({
  meta: {
    name: 'sync:resource',
    description: 'Sync Notion Resources into cache',
  },
  async run() {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const resources: ResourceQueries = {
      prospect: await notionQueryDb<NotionProspect>(notion, notionDbId.prospect),
      client: await notionQueryDb<NotionProjectClient>(notion, notionDbId.client),
      project: await notionQueryDb<NotionProject>(notion, notionDbId.project),
      content: await notionQueryDb<NotionContent>(notion, notionDbId.content),
      asset: await notionQueryDb<NotionAsset>(notion, notionDbId.asset),
      model: await notionQueryDb<NotionModel>(notion, notionDbId.model),
      studio: await notionQueryDb<NotionStudio>(notion, notionDbId.studio),
    }
    const results = await Promise.allSettled(Object.values(resources))

    for (const [idx, res] of results.entries()) {
      const type = Object.keys(resources)[idx] as keyof typeof resources
      const resourceStorage = useStorage<Resource>(`data:resource:${type}`)

      if (res.status === 'fulfilled')
        await Promise.allSettled(
          res.value.map(async (record) => {
            const resource = (await resourceStorage.getItem(normalizeNotionId(record.id))) ?? {
              type,
              notificationStatus: false,
              record,
            }

            resource.record = record
            resourceStorage.setItem(normalizeNotionId(record.id), resource)
          })
        )
      else console.warn(`Notion fetch failed for ${type}:`, res.reason)
    }

    return { result: 'success' }
  },
})
