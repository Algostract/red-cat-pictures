<script setup lang="ts">
const title = `Experience`
const description = `Experience Our Image Gallery In 3D`
const {
  public: { siteUrl, cdnUrl },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/exprience.webp`

definePageMeta({ layout: false })
useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/experience`,
})

const { data: photos } = await useAPI('/api/photo')

const categoryOrder = ['product', 'food', 'ecommerce'] as Category[]

const allPhotos = computed(() => {
  const filterPhotos = photos.value!.filter(({ gallery }) => gallery)
  const needed = (12 - (filterPhotos.length % 12)) % 12
  const indexToSlice = filterPhotos.findIndex(({ category }) => category === 'food')
  const extra = filterPhotos.slice(indexToSlice, indexToSlice + needed)

  return categoryOrder.flatMap((cat) => filterPhotos.concat(extra).filter((p) => p.category === cat))
})

const frameHeight = 4
const gapX = 0.3
const gapY = 0.3
const maxRows = 5

const cols = computed(() => Math.ceil(allPhotos.value!.length / maxRows))
const columns = computed(() => Array.from({ length: cols.value }, (_, col) => allPhotos.value!.slice(col * maxRows, col * maxRows + maxRows)))

const colWidths = computed(() => columns.value.map((col) => Math.max(...col.map((p) => frameHeight * p.aspectRatio))))

const xOffsets = computed(() => {
  const totalW = colWidths.value.reduce((sum, w) => sum + w, 0) + gapX * (cols.value - 1)
  let acc = -totalW / 2
  return colWidths.value.map((w) => {
    const x = acc + w / 2
    acc += w + gapX
    return x
  })
})

const totalH = maxRows * frameHeight + (maxRows - 1) * gapY

const frames = computed(() =>
  columns.value.flatMap((col, j) =>
    col.map((p, row) => ({
      image: p.image,
      aspectRatio: p.aspectRatio,
      position: [xOffsets.value[j], totalH / 2 - frameHeight / 2 - row * (frameHeight + gapY), 0] as [number, number, number],
    }))
  )
)
</script>

<template>
  <TresCanvas shadows alpha window-size power-preference="high-performance" clear-color="#000000">
    <OrbitControls
      :target="[0, 0, 0]"
      enable-rotate
      enable-pan
      enable-zoom
      :min-polar-angle="Math.PI / 2 - 0.1"
      :max-polar-angle="Math.PI / 2 + 0.1"
      :min-distance="2"
      :max-distance="25"
      :min-azimuth-angle="-Math.PI / 4 - 0.01"
      :max-azimuth-angle="Math.PI / 4 + 0.01" />
    <TresMesh :position="[0, 0, -1]" :rotation="[0, 0, 0]" :scale="[200, 50, 1]">
      <TresPlaneGeometry />
      <TresMeshBasicMaterial>
        <GradientTexture :stops="[0, 0.25, 0.75, 1]" :colors="['#171717', '#404040', '#404040', '#171717']" attach="map" />
      </TresMeshBasicMaterial>
    </TresMesh>
    <Suspense>
      <PhotoFrame
        v-for="{ image, aspectRatio, position } in frames"
        :key="image"
        :photo="`${cdnUrl}/image/s_${Math.round(720 * aspectRatio)}x720/${image}`"
        :aspect-ratio="aspectRatio"
        :position="position" />
    </Suspense>
    <TresPerspectiveCamera :position="[0, 0, 20]" :rotation="[0, 0, 0]" :fov="45" :aspect="1" :near="0.1" :far="1000" />
    <TresDirectionalLight :position="[0, 2, 2]" :intensity="2.5" cast-shadow />
  </TresCanvas>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
}
</style>
