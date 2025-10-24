import { convertSources, heroPreset, landscapePreset, portraitPreset } from './index.get'

export default defineCachedEventHandler<Promise<VideoDetails>>(
  async (event) => {
    try {
      const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
      const assets = (await assetStorage.getItems(await assetStorage.getKeys())).flatMap(({ value }) => value.record)

      const slug = getRouterParam(event, 'slug')!.toString().replace(/,$/, '')

      const videos = assets.filter(({ properties }) => properties.Type?.select?.name === 'Video' && properties.Status.status?.name === 'Release')

      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

      const video = videos.find(({ properties }) => properties.Slug.formula.string === slug)
      if (!video) {
        throw createError({ statusCode: 404, statusMessage: `video ${slug} not found` })
      }

      const [aW, aH] = video.properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))
      const aspectRatio = aW / aH

      return {
        id: slug,
        title: notionTextStringify(video.properties.Name.title),
        description: notionTextStringify(video.properties.Description.rich_text),
        type: slug === 'hero' ? 'hero' : 'feature',
        poster: video.cover?.type === 'external' ? video.cover.external.url.split('/')[5] : undefined,
        sources: convertSources(slug, slug === 'hero' ? heroPreset : aspectRatio < 1 ? portraitPreset : landscapePreset),
        url: `/video/${slug}`,
      } as VideoDetails
    } catch (error: unknown) {
      console.error('API video/slug GET', error)

      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 60, swr: true }
)
