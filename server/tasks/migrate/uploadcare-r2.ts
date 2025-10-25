export default defineTask({
  meta: {
    name: 'migrate:media',
    description: 'Sync Notion Resources into cache',
  },
  async run() {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    // const projects = await notionQueryDb<NotionProject>(notion, notionDbId.project)
    const assets = await notionQueryDb<NotionAsset>(notion, notionDbId.asset)

    // console.log(projects.map((asset) => asset.properties.Slug.formula.string))
    // console.log(assets.map((asset) => asset.properties.Project.relation))

    /*     const fullProject = projects
          .map(({ id, properties }) => ({
            index: properties.Index.number,
            name: properties.Slug.formula.string,
            assets: assets
              .filter((asset) => asset.properties.Project.relation[0]?.id === id)
              .map(({ properties }) => ({
                index: properties.Index.number,
                name: properties.Slug.formula.string,
              }))
              .sort((a, b) => a.index - b.index),
          }))
          .sort((a, b) => a.index - b.index) */

    for await (const asset of assets) {
      // current cover -> https://ucarecdn.com/17dc5f16-3961-47c2-9ea2-996b4fac0d19/-/preview/1620x1080/
      // update cover -> https://cdn.redcatpictures.com/media/w_1620&h_1080/product-photo-033-033

      if (!(asset.properties.Type.select.name === 'Video' && asset.properties.Status.status.name === 'Plan')) continue

      const slug = asset.properties.Slug?.formula?.string || asset.id
      const [aW, aH] = asset.properties['Aspect ratio'].select.name.split(':').flatMap((item) => parseInt(item))
      const aspectRatio = aW / aH
      const { width: coverWidth, height: coverHeight } = calculateDimension(1080, aspectRatio)

      const cdnUrl = 'https://cdn.redcatpictures.com/media'
      const updateCoverURL = `${cdnUrl}/w_${coverWidth}&h_${coverHeight}/${slug}`

      let coverExists = false
      try {
        await $fetch(updateCoverURL, { method: 'HEAD' })
        coverExists = true
      } catch {
        coverExists = false
      }

      console.log('Updating', slug)

      await notion.pages.update({
        page_id: asset.id,
        cover: coverExists
          ? {
              type: 'external',
              external: { url: updateCoverURL },
            }
          : null,
        properties: {
          Status: {
            status: {
              name: coverExists ? asset.properties.Status.status.name : 'Plan',
            },
          },
        },
      })
    }

    return { result: '' }
  },
})
