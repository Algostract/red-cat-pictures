import { toUint8Array } from 'undio'
import type { Codec, Device, Orientation, Resolution } from '~~/server/utils/transcode-video'
import transcodeVideo from '~~/server/utils/transcode-video'

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const storage = useStorage('fs')
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    // const file = JSON.parse(formData.get('file') as string) as { name: string; size: string }
    const targetCodecs = JSON.parse(formData.get('codecs') as string) as Codec[]
    const targetResolutions = JSON.parse(formData.get('resolutions') as string) as Resolution[]
    const targetOrientation = formData.get('orientation') as Orientation
    const targetDevice = formData.get('device') as Device

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

          const { width = 0, height = 0 } = await getMediaDimensions(file.name, 'video')
          const resolutionLabel = getResolution(width, height)
          const aspectRatioLabel = getAspectRatio(width, height)

          const results = []
          for (const codec of targetCodecs) {
            for (const resolution of targetResolutions) {
              const status = await transcodeVideo(file.name, resolution, targetOrientation, codec, targetDevice, streamResponse)
              results.push(status)
            }
          }

          console.log(`File processed ${file.name}`)

          // Save to notion
          await notion.pages.create({
            parent: {
              database_id: notionDbId.asset,
            },
            /*  cover: {
               type: 'external',
               external: {
                 url: '',
               },
             }, */
            properties: {
              Name: {
                type: 'title',
                title: [
                  {
                    type: 'text',
                    text: {
                      content: 'New Video',
                    },
                  },
                ],
              },
              Slug: {
                type: 'rich_text',
                rich_text: [
                  {
                    text: {
                      content: file.name.split('.')[0],
                    },
                  },
                ],
              },
              /*  Description: {
                 type: 'rich_text',
                 rich_text: [
                   {
                     text: {
                       content: '',
                     },
                   },
                 ],
               }, */
              Type: {
                type: 'select',
                select: {
                  name: 'Video',
                },
              },
              Status: {
                type: 'status',
                status: {
                  name: 'Plan',
                },
              },
              /*  Category: {
                 type: 'select',
                 select: {
                   name: category,
                 },
               }, */

              /*  Gallery: {
                 type: 'number',
                 number: gallery,
               },
               Featured: {
                 type: 'number',
                 number: featured,
               }, */
              Resolution: {
                type: 'select',
                select: {
                  name: resolutionLabel,
                },
              },
              'Aspect ratio': {
                type: 'select',
                select: {
                  name: aspectRatioLabel,
                },
              },
            },
          })

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
