<script setup lang="ts">
const props = defineProps<{
  prices: {
    [key: string]: {
      title: string
      price: number
      unit: string
      points: {
        icon: string
        content: string
      }[]
    }[]
  }
  tabs: {
    title: Categories
    icon: string
  }[]
  activeTab: Categories
}>()

const emit = defineEmits<{ (event: 'changeTab', value: Categories): void }>()

const { gtag } = useScriptGoogleAnalytics()

const splideOption = computed(() => ({
  mediaQuery: 'min',
  arrows: true,
  pagination: false,
  trimSpace: true,
  focus: 'center',
  perPage: 1,
  padding: '1rem',
  gap: '-2.5rem',
  ...(props.tabs.length > 1
    ? {
        breakpoints: {
          768: {
            destroy: true,
            arrows: false,
            // perPage: 3,
            // padding: 0,
            // gap: '1.5rem',
          },
        },
      }
    : {
        destroy: 'completely',
        arrows: false,
        trimSpace: true,
      }),
}))

const activeSlideIndex = ref(1)
const isModelContactOpen = ref<boolean>(false)

function onContact(action: boolean) {
  if (action) {
    isModelContactOpen.value = true
    gtag('event', 'contact_open')
  } else {
    isModelContactOpen.value = false
    gtag('event', 'contact_close')
  }
}
</script>

<template>
  <section class="relative -left-4 w-screen md:left-0 md:w-full">
    <div class="mx-auto mb-4 flex w-fit gap-4 md:mb-12">
      <ButtonTab v-for="{ icon, title } in tabs" :key="title" :icon="icon" :title="title" :active="activeTab === title" @click="emit('changeTab', title)" />
    </div>
    <Splide :options="splideOption" tag="div" :has-track="false" @move="(slideIndex: number) => (activeSlideIndex = slideIndex)">
      <SplideTrack>
        <SplideSlide v-for="({ title, price, unit, points }, index) in prices[activeTab]" :key="title" class="flex justify-center">
          <ModalPrice :active="index === activeSlideIndex" :title="title" :price="price" :unit="unit" :points="points" @contact="onContact(true)" />
        </SplideSlide>
      </SplideTrack>
      <div class="splide__arrows absolute left-0 right-0 top-1/2 flex justify-between text-[24px] text-black">
        <button class="splide__arrow splide__arrow--prev arrow relative">
          <NuxtIcon name="chevron-bold" class="relative z-10" />
        </button>
        <button class="splide__arrow splide__arrow--next arrow relative scale-x-[-1]">
          <NuxtIcon name="chevron-bold" class="relative z-10" />
        </button>
      </div>
    </Splide>
    <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
  </section>
</template>

<style>
#pricing-image ul.splide__list {
  @apply md:!flex md:w-full md:items-center md:justify-between;
}

#pricing-video ul.splide__list {
  @apply md:!flex md:w-full md:items-center md:justify-center;
}

#pricing-image .arrow,
#pricing-video .arrow {
  @apply bg-transparent before:absolute before:left-0 before:top-1/2 before:block before:size-16 before:-translate-x-1/2 before:-translate-y-1/2 before:rotate-45 before:rounded-xl before:bg-primary-500 before:transition-colors before:duration-500 before:ease-out before:content-[''] active:before:bg-primary-400 disabled:text-white disabled:before:bg-dark-600;
}
</style>
