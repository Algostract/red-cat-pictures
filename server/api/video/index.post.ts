import { toUint8Array } from 'undio'
import type { Codec, Device } from '~~/server/utils/transcode-video'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    const targetCodecs = JSON.parse(formData.get('codecs') as string) as Codec[]
    const targetResolutions = JSON.parse(formData.get('resolutions') as string) as Resolution[]
    const targetDevice = formData.get('device') as Device
    const projectSlug = formData.get('projectSlug') as string

    if (!file || !file.size) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    const config = useRuntimeConfig()
    const storage = useStorage('fs')
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    const eventStream = createEventStream(event)
    const streamResponse = (data: object) => eventStream.push(JSON.stringify(data))

    event.waitUntil(
      (async () => {
        try {
          const buffer = await toUint8Array(file)
          await storage.setItemRaw(`videos/source/${file.name}`, buffer)

          console.log(`File Saved ${file.name}`)
          await streamResponse({
            fileName: file.name,
            status: `saved`,
          })

          const { width: originalWidth = 0, height: originalHeight = 0 } = await getDimension(file.name, 'video')
          const resolutionLabel = getResolution(originalWidth, originalHeight)
          const resolution = parseInt(resolutionLabel.slice(0, -1))
          const aspectRatioLabel = getAspectRatio(originalWidth, originalHeight)
          const [aW, aH] = aspectRatioLabel.split(':').flatMap((item) => parseInt(item))
          const aspectRatio = aW / aH
          const { width: expectedWidth, height: expectedHeight } = calculateDimension(resolution, aspectRatio)
          const { width: coverWidth, height: coverHeight } = calculateDimension(1080, aspectRatio)

          const results = []
          for (const codec of targetCodecs) {
            for (const resolutionLabel of targetResolutions) {
              const resolution = parseInt(resolutionLabel.slice(0, -1))
              const expectedDim = calculateDimension(resolution, aspectRatio)

              const status = await transcodeVideo(`./static/videos/source/${file.name}`, `./static/videos`, expectedDim, codec, targetDevice, streamResponse)
              results.push(status)
            }
          }

          console.log(`File processed ${file.name}`)

          await generateThumbnail(`./static/videos/source/${file.name}`, `./static/photos/source`, '00:00:00.500')
          // Transcode image
          const imageFile = await transcodeImage(`./static/photos/source/${file.name.split('.')[0]}.jpg`, `./static/photos`, expectedWidth, expectedHeight)
          // Upload to uploadcare cdn
          const { file: fileId } = await uploadcareUploadImage(imageFile)

          const response = await notionQueryDb<NotionAsset>(notion, notionDbId.asset, {
            filter: {
              and: [
                {
                  property: 'Project',
                  relation: projectSlug
                    ? {
                        contains: projectSlug,
                      }
                    : {
                        is_empty: true,
                      },
                },
                {
                  property: 'Type',
                  select: {
                    equals: 'Video',
                  },
                },
              ],
            },
          })
          const lastIndex = response.reduce((max, page) => {
            const indexValue = page.properties?.Index?.number ?? 0

            return indexValue > max ? indexValue : max
          }, 0)

          await notion.pages.create({
            parent: {
              database_id: notionDbId.asset,
            },
            cover: {
              type: 'external',
              external: {
                url: `https://ucarecdn.com/${fileId}/-/preview/${coverWidth}x${coverHeight}/`,
              },
            },
            properties: {
              Index: {
                type: 'number',
                number: lastIndex + 1,
              },
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
              Description: {
                type: 'rich_text',
                rich_text: [
                  {
                    text: {
                      content: '',
                    },
                  },
                ],
              },
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
            fileName: file.name,
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
