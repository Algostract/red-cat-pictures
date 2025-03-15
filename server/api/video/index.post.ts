import { toUint8Array } from 'undio'
import type { Codec, Device, Orientation, Resolution } from '~~/server/utils/transcode-video'
import transcodeVideo from '~~/server/utils/transcode-video'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    const targetCodecs = JSON.parse(formData.get('codecs') as string) as Codec[]
    const targetResolutions = JSON.parse(formData.get('resolutions') as string) as Resolution[]
    const targetOrientation = formData.get('orientation') as Orientation
    const targetDevice = formData.get('device') as Device
    const storage = useStorage('fs')

    if (!file || !file.size) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    const eventStream = createEventStream(event)
    const streamResponse = (data: object) => eventStream.push(JSON.stringify(data))

    event.waitUntil(
      (async () => {
        try {
          const buffer = await toUint8Array(file)
          await storage.setItemRaw(`videos/source/${file.name}`, buffer)
          console.log(`File Saved ${file.name}`)
          await streamResponse({
            file: file.name,
            status: `saved`,
          })

          const results = []
          for (const codec of targetCodecs) {
            for (const resolution of targetResolutions) {
              const status = await transcodeVideo(file.name, resolution, targetOrientation, codec, targetDevice, streamResponse)
              results.push(status)
            }
          }

          console.log(`File processed ${file.name}`)
          await streamResponse({
            file: file.name,
            status: `processed`,
            size: file.size,
            results,
          })
        } catch (error) {
          await streamResponse({ error: (error as Error).message })
        } finally {
          eventStream.close()
        }
      })()
    )

    return eventStream.send()
  } catch (error: unknown) {
    console.error('API video POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
