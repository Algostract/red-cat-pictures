import type { Codec, Resolution } from '~~/server/utils/transcode-video'

export function convertSources(sources: FileSources): Source[] {
  const result: Source[] = []
  // Iterate over each codec key (e.g. "av1", "vp9", "avc", "hevc")
  for (const codec of Object.keys(sources) as Codec[]) {
    const codecSources = sources[codec]
    if (!codecSources) continue
    // Iterate over each resolution (e.g. "1080p", "1440p", "720p")
    for (const resolution of Object.keys(codecSources) as Resolution[]) {
      const resSources = codecSources[resolution]
      if (!resSources) continue
      // Get all orientation keys available for this resolution.
      const orientationKeys = Object.keys(resSources) as ('landscape' | 'portrait')[]
      // Check if both orientations are present.
      const hasBoth = orientationKeys.includes('landscape') && orientationKeys.includes('portrait')
      console.log({ orientationKeys })
      // Iterate over each orientation.
      for (const orientation of orientationKeys) {
        const files = resSources[orientation]
        if (!files) continue
        // If both orientations exist, use media query; otherwise, use an empty string.
        const media = hasBoth ? (orientation === 'landscape' ? '(orientation: landscape)' : '(orientation: portrait)') : ''
        for (const file of files) {
          result.push({
            src: '/media/video/' + file.src,
            type: file.type,
            media,
            codec, // attach codec info
            resolution, // attach resolution info
          })
        }
      }
    }
  }
  return result
}

export default defineCachedEventHandler<Promise<Video[]>>(
  async () => {
    try {
      const videos = await readYamlFile<FileVideoItem>('videos.yml')
      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })
      return videos.map(({ sources, ...rest }) => ({
        ...rest,
        sources: convertSources(sources),
      }))
    } catch (error: unknown) {
      console.error('API video GET', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 0 * 60 }
)
