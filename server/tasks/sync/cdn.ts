export default defineTask({
  meta: {
    name: 'sync:cdn',
    description: 'Sync Drive Resources into CDN',
  },
  async run() {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const assets = await notionQueryDb<NotionAsset>(notion, notionDbId.asset)

    for await (const asset of assets) {
      // current cover -> https://ucarecdn.com/17dc5f16-3961-47c2-9ea2-996b4fac0d19/-/preview/1620x1080/
      // update cover -> https://cdn.redcatpictures.com/media/w_1620&h_1080/product-photo-033-033

      // asset.properties.Type.select.name === 'Photo' && asset.properties.Status.status.name === 'Plan'
      if (!(asset.properties.Status.status.name === 'Plan')) continue

      const slug = asset.properties.Slug?.formula?.string === 'featured-video-000-000' ? asset.properties.Slug?.formula?.string + '-landscape' : asset.properties.Slug?.formula?.string
      const [aW, aH] = asset.properties['Aspect ratio'].select.name.split(':').flatMap((item) => parseInt(item))
      const aspectRatio = aW / aH
      const { width: coverWidth, height: coverHeight } = calculateDimension(1080, aspectRatio)

      let updateCoverURL = `${config.public.cdnUrl}/image/w_${coverWidth}&h_${coverHeight}/${slug}`

      let coverExists = false
      try {
        await $fetch(updateCoverURL, { method: 'HEAD' })
        coverExists = true
      } catch {
        coverExists = false
      }

      if (!coverExists) {
        console.log('🚩 Failed Updating', { slug, updateCoverURL })
        continue
      }

      updateCoverURL = `https://cdn.redcatpictures.com/media/image/w_${coverWidth}&h_${coverHeight}/${slug}`
      console.log('🍃 Updating', { slug, updateCoverURL })

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
              name: asset.properties.Status.status.name, //coverExists ? (asset.properties.Status.status.name !== 'Plan' ? asset.properties.Status.status.name : 'Draft') : 'Plan',
            },
          },
        },
      })
    }

    return { result: '' }
  },
})
