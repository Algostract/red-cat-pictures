<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
}>()

const allImages = usePhoto(props.photos, [
  'Food-004-001',
  'Food-002-001',
  'Food-003-001',
  'Food-001-001',
  'Food-005-001',
  'Food-007-001',
  'Food-006-001',
  'Food-009-001',
  'Food-008-001',
  // 'Food-006-002',
  'Product-001-001',
  'Product-002-001',
  'Product-003-001',
  'Product-004-001',
  'Product-005-001',
  'Product-006-001',
  'Product-007-001',
  'Product-008-001',
])

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

const slideCounts = ['2', '3'] as const

const imageSlides = computed(() => {
  const slides = slideCounts.map((noOfSlides) => {
    const slides: { id: string; title: string }[][] = new Array(parseInt(noOfSlides)).fill(null).map((_) => [])

    allImages.value.forEach((image, index) => {
      slides[index % noOfSlides].push(image)
    })

    return slides
  })

  return {
    2: slides[0],
    3: slides[1],
  }
})
</script>

<template>
  <section id="featured" ref="container" class="relative z-0 mx-0 h-screen overflow-hidden bg-light-400 dark:bg-dark-400 md:-mx-12">
    <div v-show="isSliderVisible" ref="slider" class="relative z-10 flex gap-2 transition-all duration-[2s] ease-linear" :style="{ translate: `0 ${-offset}px` }">
      <!-- For Small Screen Devices -->
      <template v-for="slideCount in slideCounts">
        <div
          v-for="(images, index) in imageSlides[slideCount]"
          :key="index"
          class="flex flex-1 flex-col gap-2"
          :class="{
            'translate-y-5': index == 0,
            '-translate-y-4': index == 1,
            'translate-y-12': index == 2,
            'flex md:hidden': slideCount == '2',
            'hidden md:flex': slideCount == '3',
          }">
          <NuxtImg v-for="{ id, title } in images" :key="id" provider="uploadcare" :src="id + '/-/preview/1280x960/'" :alt="title" :width="1280" class="w-full rounded-sm object-cover" />
        </div>
      </template>
      <!-- For Large Screen Devices -->
    </div>
    <Transition>
      <div v-show="isEndVisible" class="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center text-primary-500">
        <NuxtIcon name="logo-full" class="text-[196px] drop-shadow-md md:text-[356px]" />
      </div>
    </Transition>
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
