import { toUint8Array } from 'undio'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    const file = formData.get('file') as File

    const title = formData.get('title') as string
    const fileName = title ? `${title}.${file.name.split('.').at(-1)?.toLowerCase()}` : file.name
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
    await storage.setItemRaw(`photos/source/${fileName}`, buffer)
    console.log(`File Saved ${fileName}`)

    const { width = 0, height = 0 } = await getDimension(fileName, 'photo')
    const resolutionLabel = getResolution(width, height)
    const resolution = parseInt(resolutionLabel.slice(0, -1))
    const aspectRatioLabel = getAspectRatio(width, height)
    const [aW, aH] = aspectRatioLabel.split(':').flatMap((item) => parseInt(item))
    const aspectRatio = aW / aH
    const { width: expectedWidth, height: expectedHeight } = calculateDimension(resolution, aspectRatio)
    const { width: coverWidth, height: coverHeight } = calculateDimension(1080, aspectRatio)

    // Transcode image
    const imageFile = await transcodeImage(`./static/photos/source/${fileName}`, `./static/photos`, expectedWidth, expectedHeight)
    // Upload to uploadcare cdn
    const { file: id } = await uploadcareUploadImage(imageFile)

    await notion.pages.create({
      parent: {
        database_id: notionDbId.asset,
      },
      cover: {
        type: 'external',
        external: {
          url: `https://ucarecdn.com/${id}/-/preview/${coverWidth}x${coverHeight}/`,
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
        Slug: {
          type: 'rich_text',
          rich_text: [
            {
              text: {
                content: slugify(title),
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
        Type: {
          type: 'select',
          select: {
            name: 'Photo',
          },
        },
        Status: {
          type: 'status',
          status: {
            name: 'Plan',
          },
        },
        Segment: {
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

    return { success: true }
  } catch (error: unknown) {
    console.error('API photo POST', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
