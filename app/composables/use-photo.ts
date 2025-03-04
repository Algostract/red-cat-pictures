export default function (photos: Photo[] | Ref<globalThis.Photo[] | null>, properties: { section: 'gallery' | 'featured'; category?: Category }): ComputedRef<Photo[]> {
  const order = {
    ecommerce: 0,
    product: 1,
    food: 2,
  }

  const filteredImages = computed(
    () =>
      toValue(photos)
        ?.filter(({ category, gallery, featured }) => {
          if (properties.section === 'gallery' && gallery !== null) return true

          if (properties.section === 'featured' && featured !== null && properties.category === category) return true

          return false
        })
        .toSorted((a, b) => {
          const categoryDiff = order[a.category] - order[b.category]
          if (categoryDiff !== 0) return categoryDiff

          if (properties.section === 'gallery' && a.gallery !== null && b.gallery !== null) return a.gallery - b.gallery

          if (properties.section === 'featured' && a.featured !== null && b.featured !== null) return a.featured - b.featured

          return a.featured === null ? 1 : -1
        }) ?? []
  )

  return filteredImages
}
