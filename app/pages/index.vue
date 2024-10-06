<script setup lang="ts">
import type { Categories } from '~/utils/types'

const title = `Professional Food & Product photography/Videography in Kolkata`
const description = `Nurture the essence of your food & product with our photography & videography services in Kolkata`
const url = 'https://redcatpictures.com'

useSeoMeta({
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description,
  ogImage: url + '/previews/landing.webp',
  ogUrl: url,
})

const { data: photos } = useFetch('/api/photo', { default: () => [] })

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const isModelContactOpen = ref<boolean>(false)

function onContact(action: boolean) {
  if (action) {
    isModelContactOpen.value = true
    gaProxy.gtag('event', 'contact_open')
  } else {
    isModelContactOpen.value = false
    gaProxy.gtag('event', 'contact_close')
  }
}

const pricePhoto = {
  food: [
    {
      title: 'Basic Photography',
      price: 3500,
      unit: 'session',
      points: [
        { icon: 'photo', content: '20 Photos' },
        { icon: 'photo', content: 'Basic editing, color correction' },
        {
          icon: 'photo',
          content: 'High-resolution images delivered via online gallery',
        },
      ],
    },
    {
      title: 'Premium Photography',
      price: 5500,
      unit: 'session',
      points: [
        { icon: 'photo', content: '20 Photos' },
        {
          icon: 'photo',
          content: 'Advanced editing, retouching, and color correction ',
        },
        {
          icon: 'photo',
          content: 'High-resolution images delivered via online gallery',
        },
      ],
    },
    {
      title: 'Standard Videography',
      price: 3500,
      unit: 'session',
      points: [
        { icon: 'photo', content: '1 Minute Video' },
        {
          icon: 'photo',
          content: 'Extensive editing, retouching, and color grading',
        },
        {
          icon: 'photo',
          content: 'High-resolution video delivered via online gallery',
        },
      ],
    },
  ],
  product: [
    {
      title: 'Basic Photography',
      price: 100,
      unit: 'photo',
      points: [
        { icon: 'photo', content: '20 Photos' },
        { icon: 'photo', content: 'Basic editing, color correction' },
        {
          icon: 'photo',
          content: 'High-resolution images delivered via online gallery',
        },
      ],
    },
    {
      title: 'Premium Photography',
      price: 200,
      unit: 'photo',
      points: [
        { icon: 'photo', content: '20 Photos' },
        {
          icon: 'photo',
          content: 'Dynamic angle, retouching, and color correction',
        },
        {
          icon: 'photo',
          content: 'High-resolution images delivered via online gallery',
        },
      ],
    },
    {
      title: 'Standard Videography',
      price: 800,
      unit: 'video',
      points: [
        { icon: 'photo', content: '30 Second Video' },
        {
          icon: 'photo',
          content: 'Extensive editing, retouching, and color grading',
        },
        {
          icon: 'photo',
          content: 'High-resolution video delivered via online gallery',
        },
      ],
    },
  ],
}

const pricesVideo = {
  commercial: [
    {
      title: 'Commercial Videography',
      price: 2000,
      unit: 'video',
      points: [
        { icon: 'photo', content: '15 sec Video, Minimum 2 Video' },
        {
          icon: 'photo',
          content: 'Extensive editing, retouching, and color grading',
        },
        {
          icon: 'photo',
          content: 'High-resolution video delivered via online gallery',
        },
      ],
    },
  ],
}

const tabs = ref([
  {
    icon: 'pizza',
    title: 'food' as const,
  },
  {
    icon: 'box',
    title: 'product' as const,
  },
])

const activeTab = ref<Categories>('food')

function changeActiveTab(tab: Categories) {
  activeTab.value = tab
}
</script>

<template>
  <div>
    <AppHeader />
    <main class="relative mx-auto flex max-w-[90rem] flex-col gap-4 overflow-hidden p-4 !pb-0 lg:gap-16 lg:p-16">
      <SectionHero :photos="photos" @contact="onContact(true)" />
      <SectionFeatured :photos="photos" />
      <SectionGallery :photos="photos" :tabs="tabs" :active-tab="activeTab" @change-tab="changeActiveTab" />
      <SectionPricing id="pricing-image" :prices="pricePhoto" :tabs="tabs" :active-tab="activeTab" @change-tab="changeActiveTab" />
      <SectionVideo />
      <SectionPricing id="pricing-video" :prices="pricesVideo" :tabs="[{ icon: 'box', title: 'commercial' }]" :active-tab="'commercial'" @change-tab="() => {}" />
      <!-- <SectionTestimonial /> -->
      <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
    </main>
    <AppFooter @contact="onContact(true)" />
  </div>
</template>
