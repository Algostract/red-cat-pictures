<script setup lang="ts">
import type { Category } from '~~/shared/types/index'

const title = `Photography & Videography in Kolkata`
const description = `Nurture the essence of your food & product with our photography & videography services in kolkata`
const url = 'https://redcatpictures.com'
const imageUrl = `${url}/previews/landing.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: `${url}/previews/landing.webp`,
  twitterImage: imageUrl,
  ogUrl: url,
})

const { data: photos } = await useFetch('/api/photo', { default: () => [] })
const { data: videos } = await useFetch('/api/video', { default: () => [] })

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
  <div class="flex flex-col gap-4">
    <ButtonFloatingAction :active-category="activeCategory" @update="(value) => (activeCategory = value)" />
    <SectionHero :video="heroVideo" @contact="onContact(true)" />
    <SectionGallery :photos="photos" />
    <SectionFeaturedPhoto :photos="photos" :active-category="activeCategory" />
    <SectionFeaturedVideo :videos="featuredVideos" :active-category="activeCategory" />
    <SectionPricing :active-category="activeCategory" />
    <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
  </div>
</template>
