export default defineCachedEventHandler<Promise<PhotoDetails>>(
  async (event) => {
    try {
      const slug = getRouterParam(event, 'slug')!.toString()
      const photos = await readYamlFile<FilePhoto>('photos.yml')

      if (!photos) throw createError({ statusCode: 500, statusMessage: 'photos is undefined' })

      const photo = photos.find(({ name }) => name === slug)
      if (!photo) {
        throw createError({ statusCode: 404, statusMessage: `photo ${slug} not found` })
      }

      return {
        name: photo.name,
        id: photo.id,
        title: photo.name,
        description: photo.description,
        category: photo.category,
        aspectRatio: photo.width / photo.height,
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
