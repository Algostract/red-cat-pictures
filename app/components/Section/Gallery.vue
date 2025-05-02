<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
  activePhoto?: string
}>()

const emit = defineEmits<{
  active: [value: string]
}>()

const allUniquePhotos = usePhoto(props.photos, { section: 'gallery' })
const allPhotos = computed(() => {
  const needed = (12 - (allUniquePhotos.value.length % 12)) % 12
  const indexToSlice = allUniquePhotos.value.findIndex(({ category }) => category === 'food')
  const extra = allUniquePhotos.value.slice(indexToSlice, indexToSlice + needed)

  return allUniquePhotos.value.concat(extra)
})

const slideCounts = ['3', '4', '6'] as const

const photoSlides = computed(() => {
  const slides = slideCounts.map((noOfSlides) => {
    const slides: Photo[][] = new Array(parseInt(noOfSlides)).fill(null).map((_) => [])

    allPhotos.value.forEach((image, index) => {
      slides[index % parseInt(noOfSlides)]!.push(image)
    })

    return slides
  })

  return {
    3: slides[0],
    4: slides[1],
    6: slides[2],
  }
})

const slider = useTemplateRef<HTMLDivElement>('slider')
const { height: sliderHeight } = useElementSize(slider)
</script>

<template>
  <section id="gallery" class="relative z-0 h-screen overflow-hidden bg-light-400 dark:bg-dark-400">
    <SectionLabel icon="grid" title="Image Gallery" />
    <div class="overflow-hidden">
      <div ref="slider" class="autoscroll-y relative z-10 flex gap-2" :style="{ animationDuration: 0.008 * sliderHeight + 's' }">
        <!-- For Small Screen Devices -->
        <template v-for="slideCount in slideCounts">
          <div
            v-for="(slidePhotos, index) in photoSlides[slideCount]"
            :key="index"
            class="flex-1 flex-col gap-2"
            :class="{
              'flex md:hidden': slideCount == '3',
              'hidden md:flex lg:hidden': slideCount == '4',
              'hidden lg:flex': slideCount == '6',
            }">
            <template v-for="dupIndex in [1, 2]" :key="dupIndex">
              <NuxtLink v-for="{ id, title, description, url } in slidePhotos" :key="`${dupIndex}-${id}`" :to="url" @click="emit('active', `${dupIndex}-${title}`)">
                <NuxtImg
                  provider="uploadcare"
                  :src="id"
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
        </template>
        <!-- For Large Screen Devices -->
      </div>
      <!-- <div class="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center text-primary-500">
          <NuxtIcon name="local:logo-full" filled class="text-[196px] drop-shadow-md md:text-[356px]" />
        </div> -->
    </div>
  </section>
</template>

<style scoped>
img.active {
  view-transition-name: selected-photo;
}
</style>
