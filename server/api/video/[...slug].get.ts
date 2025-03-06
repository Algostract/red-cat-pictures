export default defineCachedEventHandler<Promise<VideoDetails>>(
  async (event) => {
    try {
      const slug = getRouterParam(event, 'slug')!.toString()
      const videos = await readYamlFile<FileVideoItem>('videos.yml')

      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

      const video = videos.find(({ name }) => name === slug)
      if (!video) {
        throw createError({ statusCode: 404, statusMessage: `video ${slug} not found` })
      }

      return {
        name: video.name,
        poster: video.poster,
        type: video.type,
        sources: video.sources,
      } as VideoDetails
    } catch (error: unknown) {
      console.error('API video/slug GET', error)

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
