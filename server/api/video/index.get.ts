import type { Codec, Resolution } from '~~/server/utils/transcode-video'

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

export default defineCachedEventHandler<Promise<Video[]>>(
  async () => {
    try {
      const config = useRuntimeConfig()
      const notionDbId = config.private.notionDbId as unknown as NotionDB

      const videos = (await notionQueryDb<NotionAsset>(notion, notionDbId.asset))
        .filter(({ properties }) => properties.Media.select.name === 'Video' && properties.Status.status.name === 'Release')
        .toSorted((a, b) => a.properties.Gallery.number - b.properties.Gallery.number)

      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

      return videos.map<Video>(({ cover, properties }) => {
        const id = notionTextStringify(properties.Slug.rich_text)
        const [aW, aH] = properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))
        const aspectRatio = aW / aH

        return {
          id: id,
          title: notionTextStringify(properties.Name.title),
          description: notionTextStringify(properties.Description.rich_text),
          type: id === 'hero' ? 'hero' : 'feature',
          poster: cover?.type === 'external' ? cover.external.url.split('/')[3] : '',
          sources: convertSources(id, id === 'hero' ? heroPreset : aspectRatio < 1 ? portraitPreset : landscapePreset),
          url: `/video/${id}`,
        }
      })
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
  },
  { maxAge: 60 * 60 }
)
