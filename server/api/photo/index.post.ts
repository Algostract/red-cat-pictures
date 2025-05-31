import { toUint8Array } from 'undio'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as Category
    const gallery = parseInt(formData.get('gallery') as string)
    const featured = parseInt(formData.get('featured') as string)
    const storage = useStorage('fs')

    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    if (!file || !file.size) {
      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    const buffer = await toUint8Array(file)
    await storage.setItemRaw(`photos/source/${file.name}`, buffer)
    console.log(`File Saved ${file.name}`)

    const { width = 0, height = 0 } = await getMediaDimensions(file.name, 'photo')
    // Upload to uploadcare cdn

    const resolutionLabel = getResolution(width, height)
    const aspectRatioLabel = getAspectRatio(width, height)
    const aspectRatio = parseInt(aspectRatioLabel.split(':')[0]) / parseInt(aspectRatioLabel.split(':')[1])
    const url = `https://ucarecdn.com/${id}/-/preview/${Math.min(1080, Math.round(1080 * aspectRatio))}x${Math.min(1080, Math.round(1080 / aspectRatio))}/`

    await notion.pages.create({
      parent: {
        database_id: notionDbId.photo,
      },
      cover: {
        type: 'external',
        external: {
          url: url,
        },
      },
      properties: {
        Name: {
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: title,
              },
            },
          ],
        },
        Description: {
          type: 'rich_text',
          rich_text: [
            {
              text: {
                content: description,
              },
            },
          ],
        },
        Status: {
          type: 'status',
          status: {
            name: 'Plan',
          },
        },
        Category: {
          type: 'select',
          select: {
            name: category,
          },
        },
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
        Gallery: {
          type: 'number',
          number: gallery,
        },
        Featured: {
          type: 'number',
          number: featured,
        },
      },
    })
  } catch (error: unknown) {
    console.error('API photo POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
