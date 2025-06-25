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

  // union of all formats
  for (const format of new Set([...Object.keys(landscapePreset), ...Object.keys(portraitPreset)])) {
    const fmt = format as Codec
    const srcA = landscapePreset[fmt]!
    const srcB = portraitPreset[fmt]!
    merged[fmt] = { type: srcA.type || srcB.type }

    // union of all resolution keys for this format
    for (const resolution of new Set([...Object.keys(srcA), ...Object.keys(srcB)])) {
      const res = resolution as Resolution
      const orientationsA = srcA[res]!
      const orientationsB = srcB[res]!
      merged[fmt][res] = Array.from(new Set([...orientationsA, ...orientationsB]))
    }
  }

  return merged as typeof landscapePreset
})()

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
            const slug: string = properties['Sematic Slug'].formula.string

            // if (slugify(notionTextStringify(properties.Slug.rich_text)) !== slug)
            //   slugMap[slugify(notionTextStringify(properties.Slug.rich_text))] = slug

            const [aW, aH] = properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))
            const aspectRatio = aW / aH

            return {
              id: slug,
              title: notionTextStringify(properties.Name.title),
              description: notionTextStringify(properties.Description.rich_text),
              poster: cover?.type === 'external' ? cover.external.url : '',
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
  { maxAge: 60 * 1 }
)
