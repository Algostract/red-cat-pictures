import type { Codec, Resolution } from '~~/server/utils/transcode-video'

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
      const videos = await readYamlFile<FileVideo>('videos.yml')
      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })
      return videos.map<Video>(({ title, sources, ...rest }) => ({
        title,
        ...rest,
        sources: convertSources(title, sources),
        url: slugify(`/video/${title}`),
      }))
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
