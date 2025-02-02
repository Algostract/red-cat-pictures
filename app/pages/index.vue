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

const activeCategory = ref<Category>('ecommerce')
</script>

<template>
  <div>
    <AppHeader />
    <main class="relative mx-auto mb-5 flex max-w-[90rem] flex-col gap-4 overflow-hidden p-4 !pb-0 lg:p-16">
      <ButtonFloatingAction :active-category="activeCategory" @update="(value) => (activeCategory = value)" />
      <SectionHero :images="images" @contact="onContact(true)" />
      <SectionGallery :images="images" />
      <SectionFeaturedImage :images="images" :active-category="activeCategory" />
      <SectionFeaturedVideo :videos="videos" :active-category="activeCategory" />
      <SectionPricing :active-category="activeCategory" />
      <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
      <AppFooter @contact="onContact(true)" />
    </main>
  </div>
</template>
