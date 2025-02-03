<script setup lang="ts">
const props = defineProps<{
  images: Photo[]
}>()

const allImages = usePhoto(props.images, [
  // 'Ecommerce-001-001',
  'Ecommerce-001-002',
  'Ecommerce-001-003',
  // 'Ecommerce-002-001',
  'Ecommerce-002-002',
  'Ecommerce-002-003',
  'Ecommerce-003-001',
  'Ecommerce-004-001',
  'Ecommerce-005-001',
  // 'Ecommerce-005-002',
  // 'Ecommerce-006-001',
  'Ecommerce-006-002',
  // 'Ecommerce-006-003',
  'Ecommerce-006-004',
  'Ecommerce-007-001',
  'Ecommerce-007-002',
  'Ecommerce-008-001',
  'Ecommerce-008-002',
  'Ecommerce-009-001',
  // 'Ecommerce-009-002',
  // 'Ecommerce-009-003',
  // 'Ecommerce-009-004',
  // 'Ecommerce-009-005',
  // 'Ecommerce-010-001',
  // 'Ecommerce-010-002',
  'Ecommerce-010-003',
  // 'Ecommerce-010-004',
  'Ecommerce-011-001',
  'Ecommerce-012-001',
  'Ecommerce-013-001',
  'Product-001-001',
  // 'Product-001-002',
  'Product-002-001',
  // 'Product-002-002',
  'Product-003-001',
  'Product-004-001',
  // 'Product-004-002',
  'Product-005-001',
  'Product-006-001',
  'Product-007-001',
  'Product-008-001',
  'Product-009-001',
  'Product-010-001',
  'Product-011-001',
  'Product-011-002',
  'Product-011-003',
  'Product-011-004',
  'Product-012-001',
  'Product-013-001',
  'Product-014-001',
  'Product-014-002',
  'Product-015-001',
  'Product-016-001',
  'Product-016-002',
  'Product-016-003',
  'Product-016-004',
  'Product-016-005',
  'Food-001-001',
  'Food-002-001',
  'Food-003-001',
  'Food-004-001',
  'Food-005-001',
  'Food-006-001',
  // 'Food-006-002',
  'Food-007-001',
  'Food-008-001',
  'Food-009-001',
  'Food-010-001',
  'Food-011-001',
  'Food-012-001',
  'Food-013-001',
  'Food-014-001',
  'Food-015-001',
  'Food-016-001',
  'Food-017-001',
  'Food-018-001',
  'Food-019-001',
  'Food-020-001',
  'Food-021-001',
  'Food-022-001',
  'Food-023-001',
  'Food-024-001',
  'Food-025-001',
])

const activeImageName = useState()

const slideCounts = ['3', '4', '6'] as const

const imageSlides = computed(() => {
  const slides = slideCounts.map((noOfSlides) => {
    const slides: { id: string; name: string; title: string; aspectRatio: number }[][] = new Array(parseInt(noOfSlides)).fill(null).map((_) => [])

    allImages.value.forEach((image, index) => {
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
            v-for="(slideImages, index) in imageSlides[slideCount]"
            :key="index"
            class="flex-1 flex-col gap-2"
            :class="{
              'flex md:hidden': slideCount == '3',
              'hidden md:flex lg:hidden': slideCount == '4',
              'hidden lg:flex': slideCount == '6',
            }">
            <NuxtLink v-for="{ id, name, title } in slideImages" :key="id" :to="`/images/${name}`" class="" @click="activeImageName = name">
              <NuxtImg
                provider="uploadcare"
                :src="id"
                :alt="title"
                :width="960"
                :height="Math.round(960 / (3 / 4))"
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
