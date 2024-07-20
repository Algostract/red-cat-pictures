import type { Photo } from '~/utils/types'

const photo = readYamlFile<Photo>('photos.yml')

export default defineEventHandler<Photo[]>(() => {
  try {
    return photo
  } catch (error: any) {
    console.error('API photo GET', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
