<script setup lang="ts">
const title = `Product Photography & Videography in Kolkata`
const description = `Nurture the essence of your food & product with our professional photography & videography services in kolkata`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/landing.webp`

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
  ogImage: imageUrl,
  twitterImage: imageUrl,
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

const { data: allPhotos } = await useFetch('/api/photo', { default: () => [] })
const { data: allVideos } = await useFetch('/api/video', { default: () => [] })

const featuredVideo = computed(() => allVideos.value.find(({ type }) => type === 'hero')!)
const videos = computed(() => allVideos.value.filter(({ type }) => type === 'feature'))

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const activeCategory = ref<Category>('ecommerce')
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
  <div class="isolate flex flex-col gap-4">
    <LazyButtonFloatingAction hydrate-on-idle :active-category="activeCategory" @update="(value) => (activeCategory = value)" />
    <SectionHero :video="featuredVideo" @contact="onContact(true)" />
    <SectionPhotoGallery :photos="allPhotos" :active-photo="activePhotoName" @active="(name) => (activePhotoName = name)" />
    <LazySectionVideoGallery hydrate-on-visible :videos="videos" :active-category="activeCategory" />
    <LazySectionFeaturedPhoto hydrate-on-visible :photos="allPhotos" :active-category="activeCategory" :active-photo="activePhotoName" @active="(name) => (activePhotoName = name)" />
    <SectionPricing :active-category="activeCategory" />
  </div>
</template>
