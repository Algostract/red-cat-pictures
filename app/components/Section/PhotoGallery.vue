<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
  activePhoto?: string
}>()

const emit = defineEmits<{
  active: [value: string]
}>()

const categoryOrder = ['product', 'food', 'ecommerce'] as Category[]

const allPhotos = computed(() => {
  const filterPhotos = props.photos.filter(({ gallery }) => gallery)
  const needed = (12 - (filterPhotos.length % 12)) % 12
  const indexToSlice = filterPhotos.findIndex(({ category }) => category === 'food')
  const extra = filterPhotos.slice(indexToSlice, indexToSlice + needed)

  const orderedPhotos = categoryOrder.flatMap((cat) => filterPhotos.concat(extra).filter((p) => p.category === cat))

  return orderedPhotos
})

const slider = useTemplateRef<HTMLDivElement>('slider')
const { height: sliderHeight } = useElementSize(slider)
</script>

<template>
  <section id="photo-gallery" class="relative z-0 h-screen overflow-hidden bg-light-400 dark:bg-dark-400">
    <SectionLabel icon="grid" title="Photo Gallery" />
    <div class="overflow-hidden">
      <div ref="slider" class="autoscroll-y relative z-10 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6" :style="{ animationDuration: 0.008 * sliderHeight + 's' }">
        <template v-for="dupIndex in [1, 2]" :key="dupIndex">
          <NuxtLink v-for="{ id, title, image, description, url } in allPhotos" :key="`${dupIndex}-${id}`" :to="url" @click="emit('active', `${dupIndex}-${title}`)">
            <NuxtImg
              provider="uploadcare"
              :src="image"
              :alt="description"
              :width="480"
              :height="Math.round(480 / (3 / 4))"
              fit="cover"
              loading="lazy"
              :placeholder="[120, Math.round(120 / (3 / 4)), 'lightest', 25]"
              class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500"
              :class="{ active: activePhoto === `${dupIndex}-${title}` }" />
          </NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
img.active {
  view-transition-name: selected-photo;
}
</style>
