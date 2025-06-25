export default defineCachedEventHandler<Promise<Photo[]>>(
  async () => {
    try {
      const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
      const assets = (await assetStorage.getItems(await assetStorage.getKeys())).flatMap(({ value }) => value.record)

      const photos = assets.filter(({ properties }) => properties.Type?.select?.name === 'Photo' && properties.Status.status?.name === 'Release')

      if (!photos) throw createError({ statusCode: 500, statusMessage: 'photos is undefined' })

      const results = await Promise.all(
        photos
          .toSorted((a, b) => {
            const pa = b.properties['Project Index'].rollup?.array[0]?.number ?? 0
            const pb = a.properties['Project Index'].rollup?.array[0]?.number ?? 0
            return pa - pb || (b.properties.Index?.number ?? 0) - (a.properties.Index?.number ?? 0)
          })
          .map(async ({ cover, properties }): Promise<Photo | null> => {
            if (properties.Status.status.name !== 'Release') return null
            // const slug = notionTextStringify(properties.Slug.rich_text)
            const slug: string = properties['Sematic Slug'].formula.string
            const title = notionTextStringify(properties.Name.title)
            const [aW, aH] = properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))

            return {
              id: slug,
              title,
              description: notionTextStringify(properties.Description.rich_text),
              image: cover?.type === 'external' ? cover.external.url.split('/')[3] : '',
              aspectRatio: aW / aH,
              category: properties.Segment.select.name,
              gallery: properties.Gallery.checkbox,
              featured: properties.Featured.number,
              url: `/photo/${slug}`,
            }
          })
      )

      return results.filter((item) => item !== null)
    } catch (error: unknown) {
      console.error('API photo GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 1 }
)
