<script setup lang="ts">
const title = `Product, Food Photography & Videography in Kolkata, India`
const description = `Create your brand identity that speaks to your clients, with our product photography/videograpy service`

const {
  public: { siteUrl },
} = useRuntimeConfig()

useHead({
  bodyAttrs: {
    class: 'scrollbar-hidden',
  },
})

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogUrl: siteUrl,
})

useSchemaOrg([
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Photo', item: '/photo' },
      { name: 'Episode', item: '/episode' },
      { name: 'Blog', item: '/blog' },
      { name: 'About Us', item: '/about' },
    ],
  }),
])

const { data: allPhotos } = await useAPI('/api/photo', { default: () => [] })
const { data: allVideos } = await useAPI('/api/video', { default: () => [] })

const featuredVideo = computed(() => allVideos.value.find(({ type }) => type === 'hero')!)
const videos = computed(() => allVideos.value.filter(({ type }) => type === 'feature'))

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const activeCategory = ref<Category>('product')
const activePhotoName = useState<string>()
const isModelContactOpen = useState<boolean>('isModelContactOpen', () => false)

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
    <LazyButtonFloatingAction hydrate-on-idle :active-category="activeCategory" @update="(value) => (activeCategory = value)" />
    <SectionHero :video="featuredVideo" @contact="onContact(true)" />
    <SectionPhotoGallery :photos="allPhotos" :active-photo="activePhotoName" @active="(name) => (activePhotoName = name)" />
    <LazySectionVideoGallery hydrate-on-visible :videos="videos" :active-category="activeCategory" />
    <LazySectionFeaturedPhoto hydrate-on-visible :photos="allPhotos" :active-category="activeCategory" :active-photo="activePhotoName" @active="(name) => (activePhotoName = name)" />
    <SectionPricing :photos="allPhotos" />
  </div>
</template>
