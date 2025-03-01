<script setup lang="ts">
import type { Category } from '~~/shared/types/index'

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

const { data: images } = useFetch('/api/image', { default: () => [] })
const { data: videos } = useFetch('/api/video', { default: () => [] })

const heroVideo = computed(() => videos.value.find(({ type }) => type === 'hero')!)
const featuredVideos = computed(() => videos.value.filter(({ type }) => type === 'feature'))

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const isModelContactOpen = ref<boolean>(false)
const activeCategory = ref<Category>('ecommerce')

function onContact(action: boolean) {
  if (action) {
    isModelContactOpen.value = true
    gaProxy.gtag('event', 'contact_open')
  } else {
    isModelContactOpen.value = false
    gaProxy.gtag('event', 'contact_close')
  }
}
</script>

<template>
  <div>
    <AppHeader />
    <main class="relative mx-auto mb-20 flex min-h-screen max-w-[90rem] flex-col gap-4 overflow-hidden p-4 !pb-0 md:mb-8 lg:p-16">
      <ButtonFloatingAction :active-category="activeCategory" @update="(value) => (activeCategory = value)" />
      <SectionHero :video="heroVideo" @contact="onContact(true)" />
      <SectionGallery :images="images" />
      <SectionFeaturedImage :images="images" :active-category="activeCategory" />
      <SectionFeaturedVideo :videos="featuredVideos" :active-category="activeCategory" />
      <SectionPricing :active-category="activeCategory" />
      <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
      <AppFooter @contact="onContact(true)" />
    </main>
  </div>
</template>
