import { convertSources, heroPreset, landscapePreset, portraitPreset } from './index.get'

export default defineCachedEventHandler<Promise<VideoDetails>>(
  async (event) => {
    try {
      const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
      const assets = (await assetStorage.getItems(await assetStorage.getKeys('asset'))).flatMap(({ value }) => value.record)

      const slug = getRouterParam(event, 'slug')!.toString().replace(/,$/, '')

      const videos = assets.filter(({ properties }) => properties.Type.select.name === 'Video').toSorted((a, b) => a.properties.Gallery.number - b.properties.Gallery.number)

      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

      const video = videos.find(({ properties }) => notionTextStringify(properties.Slug.rich_text) === slug)
      if (!video) {
        throw createError({ statusCode: 404, statusMessage: `video ${slug} not found` })
      }

      const id = notionTextStringify(video.properties.Slug.rich_text)
      const [aW, aH] = video.properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))
      const aspectRatio = aW / aH

      return {
        id: id,
        title: notionTextStringify(video.properties.Name.title),
        description: notionTextStringify(video.properties.Description.rich_text),
        type: id === 'hero' ? 'hero' : 'feature',
        poster: video.cover?.type === 'external' ? video.cover.external.url.split('/')[3] : '',
        sources: convertSources(id, id === 'hero' ? heroPreset : aspectRatio < 1 ? portraitPreset : landscapePreset),
        url: `/video/${id}`,
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
  { maxAge: 60 * 60 }
)
