export default defineCachedEventHandler<Promise<PhotoDetails>>(
  async (event) => {
    try {
      const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
      const assets = (await assetStorage.getItems(await assetStorage.getKeys())).flatMap(({ value }) => value.record)

      const slug = getRouterParam(event, 'slug')!.toString().replace(/,$/, '')

      const photos = assets.filter(({ properties }) => properties.Type?.select?.name === 'Photo' && properties.Status.status?.name === 'Release')

      if (!photos) throw createError({ statusCode: 500, statusMessage: 'photos is undefined' })

      const photo = photos.find(({ properties }) => notionTextStringify(properties.Slug.rich_text) === slug)
      if (!photo) {
        throw createError({ statusCode: 404, statusMessage: `photo ${slug} not found` })
      }

      const id = notionTextStringify(photo.properties.Slug.rich_text)
      const [aW, aH] = photo.properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))

      return {
        id,
        title: notionTextStringify(photo.properties.Name.title),
        description: notionTextStringify(photo.properties.Description.rich_text),
        image: photo.cover?.type === 'external' ? photo.cover.external.url.split('/')[3] : '',
        aspectRatio: aW / aH,
        category: photo.properties.Segment.select.name,
        featured: photo.properties.Featured.number,
        gallery: photo.properties.Gallery.number,
        url: `/photo/${id}`,
      } as PhotoDetails
    } catch (error: unknown) {
      console.error('API photo/slug GET', error)

      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 }
)
