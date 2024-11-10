import type { Video } from '~/utils/types'

export default defineCachedEventHandler<Promise<Video[]>>(
  async () => {
    try {
      const videos = await readYamlFile<Video>('videos.yml')

      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

      return videos
    } catch (error: any) {
      console.error('API video GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 }
)
