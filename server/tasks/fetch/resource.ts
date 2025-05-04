import { Client } from '@notionhq/client'

let notion: Client

type ResourceQueries = {
  [K in ResourceType]: NotionQuery<ResourceRecordMap[K]>
}

export interface NotionQuery<T> {
  object: string
  results: T[]
  next_cursor: null
  has_more: boolean
  type: string
  request_id: string
}

export default defineTask({
  meta: {
    name: 'fetch:resource',
    description: '',
  },
  async run() {
    const config = useRuntimeConfig()
    if (!config.private.notionApiKey) {
      throw new Error('Notion API Key Not Found')
    }

    const notionDbId = config.private.notionDbId as unknown as NotionDB

    notion = notion ?? new Client({ auth: config.private.notionApiKey })

    const resources: ResourceQueries = {
      client: notion.databases.query({ database_id: notionDbId.client }) as unknown as NotionQuery<NotionProjectClient>,
      project: notion.databases.query({ database_id: notionDbId.project }) as unknown as NotionQuery<NotionProject>,
      content: notion.databases.query({ database_id: notionDbId.content }) as unknown as NotionQuery<NotionContent>,
      model: notion.databases.query({ database_id: notionDbId.model }) as unknown as NotionQuery<NotionModel>,
      studio: notion.databases.query({ database_id: notionDbId.studio }) as unknown as NotionQuery<NotionStudio>,
    }
    const results = await Promise.allSettled(Object.values(resources))

    for (const [idx, res] of results.entries()) {
      const type = Object.keys(resources)[idx] as keyof typeof resources
      const resourceStorage = useStorage<Resource>(`data:resource:${type}`)

      if (res.status === 'fulfilled')
        await Promise.allSettled(
          res.value.results.map(async (record) => {
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
