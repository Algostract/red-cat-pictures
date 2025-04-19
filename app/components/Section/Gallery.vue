<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
}>()

const allUniquePhotos = usePhoto(props.photos, { section: 'gallery' })
const allPhotos = computed(() => {
  const needed = (12 - (allUniquePhotos.value.length % 12)) % 12
  const indexToSlice = allUniquePhotos.value.findIndex(({ category }) => category === 'food')
  const extra = allUniquePhotos.value.slice(indexToSlice, indexToSlice + needed)

  return allUniquePhotos.value.concat(extra)
})

const activePhotoName = useState()

const slideCounts = ['3', '4', '6'] as const

const photoSlides = computed(() => {
  const slides = slideCounts.map((noOfSlides) => {
    const slides: { id: string; name: string; description: string; aspectRatio: number }[][] = new Array(parseInt(noOfSlides)).fill(null).map((_) => [])

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
      <div ref="slider" class="autoscroll relative z-10 flex gap-2" :style="{ animationDuration: 0.008 * sliderHeight + 's' }">
        <!-- For Small Screen Devices -->
        <template v-for="slideCount in slideCounts">
          <div
            v-for="(slideImages, index) in photoSlides[slideCount]"
            :key="index"
            class="flex-1 flex-col gap-2"
            :class="{
              'flex md:hidden': slideCount == '3',
              'hidden md:flex lg:hidden': slideCount == '4',
              'hidden lg:flex': slideCount == '6',
            }">
            <template v-for="dupIndex in [1, 2]" :key="dupIndex">
              <NuxtLink v-for="{ id, name, description } in slideImages" :key="`${dupIndex}-${id}`" :to="`/photo/${name}`" class="" @click="activePhotoName = name">
                <NuxtImg
                  provider="uploadcare"
                  :src="id"
                  :alt="description"
                  :width="480"
                  :height="Math.round(480 / (3 / 4))"
                  fit="cover"
                  format="auto"
                  loading="lazy"
                  quality="smart"
                  class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500" />
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
.overlay {
  @apply after:fixed after:left-0 after:top-0 after:z-20 after:h-screen after:w-screen after:bg-gradient-to-b after:from-black/40 after:from-[3%] after:via-transparent after:via-20% after:to-black/40 after:to-[97%] after:content-[''];
}

.autoscroll {
  animation: scroll linear infinite;
}

@keyframes scroll {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-50%);
  }
}
</style>
