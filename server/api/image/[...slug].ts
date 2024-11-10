import type { FilePhoto } from '~/utils/types'

interface Photo extends Omit<FilePhoto, 'width' | 'height'> {
  aspectRatio: number
}

export default defineCachedEventHandler<Promise<Photo[]>>(
  async () => {
    try {
      const photos = await readYamlFile<FilePhoto>('photos.yml')

      if (!photos) throw createError({ statusCode: 500, statusMessage: 'photos is undefined' })

      return photos.map(({ width, height, ...rest }) => ({ aspectRatio: width / height, ...rest }))
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
