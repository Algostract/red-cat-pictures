import { execa } from 'execa'
import { toUint8Array } from 'undio'

type Preset = 'AVC' | 'VP9' | 'HEVC' | 'AV1'

const allProcesses: {
  preset: Preset
  extension: string
  args: string
}[] = [
  {
    preset: 'AVC',
    extension: 'mp4',
    args: '-c:v libx264 -crf 23 -b:v 0 -preset slower -c:a aac',
  },
  {
    preset: 'VP9',
    extension: 'webm',
    args: '-c:v libvpx-vp9 -crf 31 -b:v 0 -deadline best -c:a libvorbis',
  },
  {
    preset: 'HEVC',
    extension: 'mp4',
    args: '-c:v libx265 -crf 28 -preset slow -c:a aac',
  },
  {
    preset: 'AV1',
    extension: 'webm',
    args: '-c:v libsvtav1 -crf 30 -b:v 0 -preset 2 -c:a libopus',
  },
]

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    const storage = useStorage('fs')

    if (!file || !file.size) throw createError({ statusCode: 400, message: 'No file provided' })

    const eventStream = createEventStream(event)
    const streamResponse = (data: object) => eventStream.push(JSON.stringify(data))

    event.waitUntil(
      (async () => {
        try {
          const buffer = await toUint8Array(file)

          await storage.setItemRaw(`videos/source/${file.name}`, buffer)
          await streamResponse({ message: 'File Saved' })

          const executions = allProcesses.map(
            ({ preset, args, extension }) =>
              new Promise<Preset>((resolve, reject) => {
                ;(async () => {
                  try {
                    console.log(`Conversion started to ${preset}`)

                    await execa({ shell: true })`ffmpeg -i ${'./static/videos/source/' + file.name} ${args} ./static/videos/${file.name.split('.')[0]}-${preset.toLowerCase()}.${extension}`

                    await streamResponse({ message: `Conversion complete to ${preset}` })

                    console.log(`Conversion complete to ${preset}`)
                    resolve(preset)
                  } catch (error) {
                    console.error(error)
                    reject(preset)
                  }
                })()
              })
          )

          const results = await Promise.allSettled(executions)

          await streamResponse({ message: 'File process completed', size: file.size, results })
        } catch (error) {
          await streamResponse({ error: (error as Error).message })
        } finally {
          eventStream.close()
        }
      })()
    )

    return eventStream.send()
  } catch (error) {
    console.error('API video POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
