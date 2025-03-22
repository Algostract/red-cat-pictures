<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
}>()

const allPhotos = usePhoto(props.photos, { section: 'gallery' })

const activePhotoName = useState()

const slideCounts = ['3', '4', '6'] as const

const photoSlides = computed(() => {
  const slides = slideCounts.map((noOfSlides) => {
    const slides: { id: string; name: string; description: string; aspectRatio: number }[][] = new Array(parseInt(noOfSlides)).fill(null).map((_) => [])

    allPhotos.value.forEach((image, index) => {
      slides[index % parseInt(noOfSlides)]!.push(image)
    })

    // allImages.value.forEach((image, index) => {
    //   slides[index % parseInt(noOfSlides)]!.push(image)
    // })

    return slides
  })

  return {
    3: slides[0],
    4: slides[1],
    6: slides[2],
  }
})

const container = ref<HTMLDivElement | null>(null)
const { height: containerHeight } = useElementSize(container)
const slider = ref<HTMLDivElement | null>(null)
const { height: sliderHeight } = useElementSize(slider)

const offsetFactor = 100
const counter = useInterval(1800)
const offset = computed(() => counter.value * offsetFactor)
const isSliderVisible = ref(true)
const isEndVisible = ref(false)

watch(offset, (value) => {
  if (offset.value >= -(containerHeight.value * (3 / 4)) && offset.value <= sliderHeight.value - containerHeight.value * (2 / 5)) isEndVisible.value = false
  else isEndVisible.value = true

  if (offset.value > -(containerHeight.value + 2 * offsetFactor)) isSliderVisible.value = true
  if (value > sliderHeight.value) isSliderVisible.value = false
  if (value > sliderHeight.value + 2 * offsetFactor) counter.value = -(containerHeight.value + 2 * offsetFactor) / offsetFactor
})
</script>

<template>
  <section id="gallery" class="relative z-0 -mx-2 h-screen overflow-hidden bg-light-400 dark:bg-dark-400 lg:-mx-12">
    <SectionLabel icon="grid" title="Image Gallery" />
    <div ref="container" class="overflow-hidden">
      <div v-show="isSliderVisible" ref="slider" class="relative z-10 flex gap-2 transition-all duration-[2s] ease-linear" :style="{ translate: `0 ${-offset}px` }">
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
            <NuxtLink v-for="{ id, name, description } in slideImages" :key="id" :to="`/photo/${name}`" class="" @click="activePhotoName = name">
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
          </div>
        </template>
        <!-- For Large Screen Devices -->
      </div>
      <Transition>
        <div v-show="isEndVisible" class="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center text-primary-500">
          <NuxtIcon name="logo-full" filled class="text-[196px] drop-shadow-md md:text-[356px]" />
        </div>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.overlay {
  @apply after:fixed after:left-0 after:top-0 after:z-20 after:h-screen after:w-screen after:bg-gradient-to-b after:from-black/40 after:from-[3%] after:via-transparent after:via-20% after:to-black/40 after:to-[97%] after:content-[''];
}

.v-enter-active,
.v-leave-active {
  @apply transition duration-[3000ms];
}

.v-enter-from,
.v-leave-to {
  @apply scale-90 opacity-0;
}
</style>
