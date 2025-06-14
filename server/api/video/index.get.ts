import type { Codec } from '~~/server/utils/transcode-video'

export const heroPreset: FileSources = {
  av1: {
    type: 'video/webm',
    '720p': ['landscape', 'portrait'],
    '1080p': ['landscape', 'portrait'],
    '1440p': ['landscape', 'portrait'],
  },
  vp9: {
    type: 'video/webm',
    '720p': ['landscape', 'portrait'],
    '1080p': ['landscape', 'portrait'],
    '1440p': ['landscape', 'portrait'],
  },
  avc: {
    type: 'video/mp4',
    '720p': ['landscape', 'portrait'],
    '1080p': ['landscape', 'portrait'],
    '1440p': ['landscape', 'portrait'],
  },
  hevc: {
    type: 'video/mp4',
    '720p': ['landscape', 'portrait'],
    '1080p': ['landscape', 'portrait'],
    '1440p': ['landscape', 'portrait'],
  },
}

export const landscapePreset: FileSources = {
  av1: {
    type: 'video/webm',
    '720p': ['landscape'],
    '1080p': ['landscape'],
    '1440p': ['landscape'],
  },
  vp9: {
    type: 'video/webm',
    '720p': ['landscape'],
    '1080p': ['landscape'],
    '1440p': ['landscape'],
  },
  avc: {
    type: 'video/mp4',
    '720p': ['landscape'],
    '1080p': ['landscape'],
    '1440p': ['landscape'],
  },
  hevc: {
    type: 'video/mp4',
    '720p': ['landscape'],
    '1080p': ['landscape'],
    '1440p': ['landscape'],
  },
}

export const portraitPreset: FileSources = {
  av1: {
    type: 'video/webm',
    '720p': ['portrait'],
    '1080p': ['portrait'],
    '1440p': ['portrait'],
  },
  vp9: {
    type: 'video/webm',
    '720p': ['portrait'],
    '1080p': ['portrait'],
    '1440p': ['portrait'],
  },
  avc: {
    type: 'video/mp4',
    '720p': ['portrait'],
    '1080p': ['portrait'],
    '1440p': ['portrait'],
  },
  hevc: {
    type: 'video/mp4',
    '720p': ['portrait'],
    '1080p': ['portrait'],
    '1440p': ['portrait'],
  },
}

export function convertSources(name: string, sources: FileSources): Source[] {
  const result: Source[] = []
  for (const codec of Object.keys(sources) as Codec[]) {
    const codecSources = sources[codec]
    if (!codecSources) continue
    const mimeType = codecSources.type
    const extension = mimeType === 'video/webm' ? 'webm' : mimeType === 'video/mp4' ? 'mp4' : ''
    const resolutionKeys = Object.keys(codecSources).filter((key) => key !== 'type') as Resolution[]
    for (const resolution of resolutionKeys) {
      const orientations = codecSources[resolution]
      if (!orientations || !Array.isArray(orientations)) continue
      const hasBoth = orientations.includes('landscape') && orientations.includes('portrait')
      for (const orientation of orientations) {
        const media = hasBoth ? (orientation === 'landscape' ? '(orientation: landscape)' : '(orientation: portrait)') : ''
        const src = `/media/video/${name}-${codec}-${resolution}-${orientation}.${extension}`
        result.push({
          src,
          type: mimeType,
          orientation,
          media,
          codec,
          resolution,
        })
      }
    }
  }
  return result
}

export default defineEventHandler<Promise<Video[]>>(async () => {
  try {
    const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
    const assets = (await assetStorage.getItems(await assetStorage.getKeys())).flatMap(({ value }) => value.record)

    const videos = assets
      .filter(({ properties }) => properties.Type?.select?.name === 'Video' && properties.Status.status?.name === 'Release')
      .toSorted((a, b) => a.properties.Gallery.number - b.properties.Gallery.number)

    if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

    const settled = await Promise.allSettled(
      videos.map<Promise<Video>>(async ({ cover, properties }) => {
        const id = notionTextStringify(properties.Slug.rich_text)
        const [aW, aH] = properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))
        const aspectRatio = aW / aH

        /*  */
        /*  const resolution = parseInt(properties.Resolution.select.name.slice(0, -1))
         const { width: expectedWidth, height: expectedHeight } = calculateDimension(resolution, aspectRatio)
         const { width: coverWidth, height: coverHeight } = calculateDimension(1080, aspectRatio)
 
         await generateThumbnail(`./static/videos/source/${id}.mp4`, `./static/videos`, '00:00:00.500')
         // Transcode image
         const imageFile = await transcodeImage(`./static/videos/${id}.jpg`, expectedWidth, expectedHeight)
         // Upload to uploadcare cdn
         const { file: fileId } = await uploadcareUploadImage(imageFile)
         const cover = { type: 'external', external: { url: `https://ucarecdn.com/${fileId}/-/preview/${coverWidth}x${coverHeight}/` } } */
        /*  */

        return {
          id: id,
          title: notionTextStringify(properties.Name.title),
          description: notionTextStringify(properties.Description.rich_text),
          type: id === 'hero' ? 'hero' : 'feature',
          poster: cover?.type === 'external' ? cover.external.url : '',
          sources: convertSources(id, id === 'hero' ? heroPreset : aspectRatio < 1 ? portraitPreset : landscapePreset),
          url: `/video/${id}`,
        }
      })
    )
    return settled.filter((result) => result.status === 'fulfilled').map((result) => result.value)
  } catch (error: unknown) {
    console.error('API video GET', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
// { maxAge: 60 * 60 * 0 }
