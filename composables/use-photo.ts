export default function (photos: Photo[] | Ref<globalThis.Photo[] | null>, imageNames: string[]): ComputedRef<Photo[]> {
  const selectedImages = computed(() =>
    imageNames.map<Photo | undefined>((name) => {
      if (!('value' in photos)) return photos ? photos.find((image) => image.name === name) : undefined
      else return photos.value ? photos.value.find((image) => image.name === name) : undefined
    })
  )
  const filteredImages = computed(() => selectedImages.value.filter((image) => image !== undefined) as Photo[])
  return filteredImages
}
