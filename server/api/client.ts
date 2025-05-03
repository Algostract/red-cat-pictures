import { Client } from '@notionhq/client'
import type { NotionDB, NotionProjectClient, NotionProject } from '~~/server/types'

interface ProjectClient {
  id: string
  name: string
  projects: string[]
  website: string
  logo?: string
}

let notion: Client

export default defineCachedEventHandler<Promise<ProjectClient[]>>(
  async () => {
    try {
      const config = useRuntimeConfig()
      if (!config.private.notionApiKey) {
        throw new Error('Notion API Key Not Found')
      }
      const notionDbId = config.private.notionDbId as unknown as NotionDB

      notion = notion ?? new Client({ auth: config.private.notionApiKey })

      const data = await notion.databases.query({ database_id: notionDbId.content })

      const projectClients = data.results as unknown as NotionProjectClient[]

      return (
        await Promise.all(
          projectClients.map(async ({ id, icon, properties }): Promise<ProjectClient | null> => {
            const name = properties.Name.title.map(({ plain_text }) => plain_text ?? '').join('') as string

            if (icon?.type !== 'external') return null

            const projects = properties.Project.relation.map(() => {
              const data = { results: { properties: { Name: { title: [{ plain_text: '' }] } } } }

              const project = data.results as unknown as NotionProject
              return project.properties.Name.title.map(({ plain_text }) => plain_text ?? '').join('') as string
            })

            return { id, name, projects, website: properties.Website.url ?? properties.Instagram.url, logo: icon.external.url }
          })
        )
      ).filter((item) => item !== null)
    } catch (error) {
      console.error('API client GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 1 }
)
