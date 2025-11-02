<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = route.params.slug!.toString()
const { data: photos } = await useAPI('/api/photo', { default: () => [] })

const activePhotoSlug = computed<string>(() => slugify(slug))
const activePhoto = computed(() => photos.value.find(({ id }) => id === activePhotoSlug.value))

if (!activePhoto.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const title = `${activePhoto.value.title}`
const description = `${activePhoto.value.description}`
const {
  public: { siteUrl, cdnUrl },
} = useRuntimeConfig()
const cover = activePhoto.value?.image ? extractCdnId(activePhoto.value?.image) : ''
const imageUrl = `${cdnUrl}/image/fit_cover&w_${Math.round(720 * activePhoto.value.aspectRatio)}&h_720/${cover}`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  viewport: {
    initialScale: 1.0,
    maximumScale: 5.0,
    minimumScale: 1.0,
    userScalable: 'yes',
    viewportFit: 'cover',
  },
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/photo/${activePhotoSlug.value}`,
})

useSchemaOrg([
  defineImage({
    url: `${siteUrl}/photo/${activePhotoSlug.value}`,
    contentUrl: imageUrl,
    caption: description,
    width: 720,
    height: Math.round(720 * activePhoto.value.aspectRatio),
  }),
])

const img = useImage()
const isImageLoaded = ref(false)
</script>

<template>
  <main v-if="activePhoto" class="relative mx-auto flex h-screen w-screen max-w-[90rem] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
    <!-- App Header -->
    <header class="absolute left-0 right-0 top-4 mx-auto max-w-[90rem] fill-black px-4 text-black dark:fill-white dark:text-white md:px-16">
      <nav class="relative z-20 grid grid-cols-3 items-center">
        <NuxtLink to="/" class="size-fit" aria-label="home">
          <NuxtIcon name="local:logo" filled class="hidden text-[64px] dark:inline md:text-[96px]" />
          <NuxtIcon name="local:logo-dark" filled class="inline text-[64px] dark:hidden md:text-[96px]" />
        </NuxtLink>
        <div class="col-start-3 justify-self-end">
          <LazyButtonColorMode hydrate-on-visible />
        </div>
      </nav>
    </header>
    <!-- App Header -->
    <div class="shimmer-overlay w-full overflow-hidden rounded-sm bg-light-600 dark:bg-dark-500 md:h-full md:w-auto">
      <NuxtImg
        :src="cover"
        :alt="activePhoto.description"
        :width="Math.round(640 * activePhoto.aspectRatio)"
        :height="640"
        fit="cover"
        loading="eager"
        preload
        :placeholder="img(cover, { w: 240, h: Math.round(240 / activePhoto.aspectRatio), q: 80 })"
        class="size-full object-cover"
        :class="{ shimmer: !isImageLoaded }"
        @load="isImageLoaded = true" />
    </div>
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>

<style scoped>
img {
  view-transition-name: selected-photo;
}
</style>
