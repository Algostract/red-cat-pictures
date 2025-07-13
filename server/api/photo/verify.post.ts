import { toUint8Array } from 'undio'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File

    if (!file || !file.size) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }
    const config = useRuntimeConfig()

    const buffer = await toUint8Array(file)
    const decoded = await stegoDecode(buffer, config.private.steganographyKey)
    const info = decoded ? JSON.parse(decoded) : undefined

    return { info }
  } catch (error: unknown) {
    console.error('API photo/verify POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
