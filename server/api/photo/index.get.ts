export default defineCachedEventHandler<Promise<Photo[]>>(
  async () => {
    try {
      const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
      const assets = (await assetStorage.getItems(await assetStorage.getKeys())).flatMap(({ value }) => value.record)

      const photos = assets
        .filter(({ properties }) => properties.Type?.select.name === 'Photo' && properties.Status.status.name === 'Release')
        .toSorted((a, b) => a.properties.Gallery.number - b.properties.Gallery.number)

      if (!photos) throw createError({ statusCode: 500, statusMessage: 'photos is undefined' })
      const order = {
        ecommerce: 0,
        product: 1,
        food: 2,
      }

      const results = await Promise.all(
        photos.map(async ({ cover, properties }): Promise<Photo | null> => {
          if (properties.Status.status.name !== 'Release') return null
          const id = notionTextStringify(properties.Slug.rich_text)
          const title = notionTextStringify(properties.Name.title)
          const [aW, aH] = properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))

          return {
            id,
            title,
            description: notionTextStringify(properties.Description.rich_text),
            image: cover?.type === 'external' ? cover.external.url.split('/')[3] : '',
            aspectRatio: aW / aH,
            category: properties.Segment.select.name,
            featured: properties.Featured.number,
            gallery: properties.Gallery.number,
            url: `/photo/${id}`,
          }
        })
      )

      return results.filter((item) => item !== null).toSorted((a, b) => order[a.category] - order[b.category])
      /* return photos
        .map(({ title, ...rest }) => ({ title: slugify(title), url: slugify(`/photo/${title}`), ...rest }))
        .toSorted((a, b) => order[a.category] - order[b.category])
        .map<Photo>(({ width, height, ...rest }) => ({ aspectRatio: width / height, ...rest })) */
    } catch (error: unknown) {
      console.error('API photo GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 * 0 }
)
