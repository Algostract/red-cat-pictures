interface ProjectClient {
  id: string
  name: string
  projects: string[]
  website: string
  logo?: string
}

export default defineCachedEventHandler<Promise<ProjectClient[]>>(
  async () => {
    try {
      const clientStorage = useStorage<Resource<'client'>>(`data:resource:client`)
      const clients = (await clientStorage.getItems(await clientStorage.getKeys()))
        .flatMap(({ value }) => value.record)
        .toSorted((a, b) => {
          const av = a.properties['Acquisition Date']?.rollup?.date?.start ?? null
          const bv = b.properties['Acquisition Date']?.rollup?.date?.start ?? null
          if (!av && !bv) return 0
          if (!av) return 1 // put empty/nulls last
          if (!bv) return -1
          return new Date(bv).getTime() - new Date(av).getTime()
        })

      return (
        await Promise.all(
          clients.map(async ({ id, icon, properties }): Promise<ProjectClient | null> => {
            const name = notionTextStringify(properties.Name.title)

            if (icon?.type !== 'external') return null

            const projects = properties.Project.relation.map(() => {
              const data = { results: { properties: { Name: { title: [{ plain_text: '' }] } } } }

              const project = data.results as unknown as NotionProject
              return notionTextStringify(project.properties.Name.title)
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
  { maxAge: 60 * 1, swr: true }
)
