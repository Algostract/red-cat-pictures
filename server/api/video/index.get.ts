import type { Codec } from '~~/shared/types'

export const resolutions = ['1440p', '1080p', '720p'] as const
// export type Resolution = (typeof resolutions)[number]

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

export const heroPreset: FileSources = (() => {
  const merged: FileSources = {}

  for (const codec of codecs.toReversed()) {
    merged[codec] = { type: portraitPreset[codec]!.type }
    for (const res of resolutions.toReversed()) {
      merged[codec]![res] = [...portraitPreset[codec]![res]!, ...landscapePreset[codec]![res]!]
    }
  }

  return merged
})()

// Use explicit RFC 6381 codec strings so browsers can quickly reject unsupported sources; for HEVC, tag as "hvc1" (not "hev1") to avoid black video on Apple decoders
function buildType(codec: Codec, containerMime: string): string {
  switch (codec) {
    case 'avc':
      return 'video/mp4; codecs="avc1, mp4a.40.2"'
    case 'hevc':
      return 'video/mp4; codecs="hvc1, mp4a.40.2"'
    case 'vp9':
      return 'video/webm; codecs="vp9, opus"'
    case 'av1':
      return containerMime === 'video/mp4' ? 'video/mp4; codecs="av01, mp4a.40.2"' : 'video/webm; codecs="av01, opus"'
  }
}

export function convertSources(name: string, sources: FileSources): Source[] {
  const {
    public: { siteUrl },
  } = useRuntimeConfig()
  const result: Source[] = []
  for (const codec of Object.keys(sources) as Codec[]) {
    const codecSources = sources[codec]
    if (!codecSources) continue
    const mimeType = codecSources.type
    const typeWithCodecs = buildType(codec, mimeType)
    const extension = mimeType === 'video/webm' ? 'webm' : mimeType === 'video/mp4' ? 'mp4' : ''
    const resolutionKeys = Object.keys(codecSources).filter((key) => key !== 'type') as Resolution[]
    for (const resolution of resolutionKeys) {
      const orientations = codecSources[resolution]
      if (!orientations || !Array.isArray(orientations)) continue
      const hasBoth = orientations.includes('landscape') && orientations.includes('portrait')
      for (const orientation of orientations) {
        const media = hasBoth ? (orientation === 'landscape' ? '(orientation: landscape)' : '(orientation: portrait)') : ''
        const src = `${siteUrl}/media/video/${name}-${codec}-${resolution}-${orientation}.${extension}`
        result.push({
          src,
          type: typeWithCodecs,
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
      const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
      const assets = (await assetStorage.getItems(await assetStorage.getKeys())).flatMap(({ value }) => value.record)

      const videos = assets.filter(({ properties }) => properties.Type?.select?.name === 'Video' && properties.Status.status?.name === 'Release')

      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

      // const slugMap: Record<string, string> = {}
      const results = await Promise.allSettled(
        videos
          .toSorted((a, b) => {
            const pa = b.properties['Project Index'].rollup?.array[0]?.number ?? 0
            const pb = a.properties['Project Index'].rollup?.array[0]?.number ?? 0
            return pa - pb || (b.properties.Index?.number ?? 0) - (a.properties.Index?.number ?? 0)
          })
          .map<Promise<Video>>(async ({ cover, properties }) => {
            const slug: string = properties.Slug.formula.string

            // if (slugify(notionTextStringify(properties.Slug.rich_text)) !== slug)
            //   slugMap[slugify(notionTextStringify(properties.Slug.rich_text))] = slug

            const [aW, aH] = properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))
            const aspectRatio = aW / aH

            return {
              id: slug,
              title: notionTextStringify(properties.Name.title),
              description: notionTextStringify(properties.Description.rich_text),
              poster: cover?.type === 'external' ? cover.external.url : undefined,
              sources: convertSources(slug, slug.includes('featured-video') ? heroPreset : aspectRatio < 1 ? portraitPreset : landscapePreset),
              type: slug.includes('featured-video') ? 'hero' : 'feature',
              category: properties.Segment.select.name,
              gallery: properties.Gallery.checkbox,
              featured: properties.Featured.number,
              url: `/video/${slug}`,
            }
          })
      )

      // return slugMap

      return results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
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
  { maxAge: 60 * 1, swr: true }
)
