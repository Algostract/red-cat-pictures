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

const { data: photos } = await useFetch('/api/photo', { default: () => [] })
const { data: videos } = await useFetch('/api/video', { default: () => [] })

const heroVideo = computed(() => videos.value.find(({ type }) => type === 'hero')!)
const featuredVideos = computed(() => videos.value.filter(({ type }) => type === 'feature'))

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
  <div class="flex flex-col gap-4">
    <LazyButtonFloatingAction hydrate-on-idle :active-category="activeCategory" @update="(value) => (activeCategory = value)" />
    <SectionHero :video="heroVideo" @contact="onContact(true)" />
    <SectionGallery :photos="photos" :active-photo="activePhotoName" @active="(name) => (activePhotoName = name)" />
    <LazySectionFeaturedPhoto hydrate-on-visible :photos="photos" :active-category="activeCategory" :active-photo="activePhotoName" @active="(name) => (activePhotoName = name)" />
    <LazySectionFeaturedVideo hydrate-on-visible :videos="featuredVideos" :active-category="activeCategory" />
    <SectionPricing :active-category="activeCategory" />
  </div>
</template>
