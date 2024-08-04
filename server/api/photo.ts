import type { Photo } from '~/utils/types'

export default defineCachedEventHandler<Photo[]>(
  () => {
    try {
      const photo = readYamlFile<Photo>('photos.yml')
      return photo
    } catch (error: any) {
      console.error('API photo GET', error)

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60 }
)
