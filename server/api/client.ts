import { Client } from '@notionhq/client'

interface NotionProjectClient {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: null
  icon: {
    type: string
    file: {
      url: string
      expiry_time: string
    }
  } | null
  properties: {
    Name: {
      title: {
        type: string
        text: {
          content: string
          link: null
        }
        plain_text: string
        href: null
      }[]
    }
    'Point of Contact': {
      id: string
      type: string
      select: {
        id: string
        name: string
        color: string
      }
    }
    Website: {
      url: string
    }
    Instagram: {
      url: string
    }
    Email: {
      email: string
    }
    Phone: {
      phone_number: string
    }
    Project: {
      id: string
      type: string
      relation: { id: string }[]
      has_more: boolean
    }
    Profit: {
      id: string
      type: string
      rollup: {
        type: string
        number: null
        function: string
      }
    }
  }
  url: string
  public_url: null
}

interface NotionProject {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: null
  icon: {
    type: string
    file: {
      url: string
      expiry_time: string
    }
  } | null
  properties: {
    Name: {
      title: {
        type: string
        text: {
          content: string
          link: null
        }
        plain_text: string
        href: null
      }[]
    }
  }
  url: string
  public_url: null
}

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

      notion = notion ?? new Client({ auth: config.private.notionApiKey })

      const data = await notion.databases.query({
        database_id: config.private.notionContentDbId,
      })

      const projectClients = data.results as unknown as NotionProjectClient[]

      return (
        await Promise.all(
          projectClients.map(async ({ id, icon, properties }): Promise<ProjectClient | null> => {
            const name = properties.Name.title.map(({ plain_text }) => plain_text ?? '').join('') as string

            if (!icon?.file) return null

            const projects = await Promise.all(
              properties.Project.relation.map(async () => {
                // const data = await notion.databases.query({
                //   database_id: id,
                // })
                const data = { results: { properties: { Name: { title: [{ plain_text: '' }] } } } }

                const project = data.results as unknown as NotionProject
                return project.properties.Name.title.map(({ plain_text }) => plain_text ?? '').join('') as string
              })
            )

            return { id, name, projects, website: properties.Website.url, logo: icon?.file.url }
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
  { maxAge: 1 * 60 }
)
