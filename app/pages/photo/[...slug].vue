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
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = `${activePhoto.value.title}`
const description = `${activePhoto.value.description}`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `https://cdn.redcatpictures.com/media/f_webp&fit_cover&w_${Math.round(720 * activePhoto.value.aspectRatio)}&h_720/${photos.value[0]?.image}`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
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
    <NuxtImg
      :src="activePhoto.image"
      :alt="activePhoto.description"
      :width="Math.round(720 * activePhoto.aspectRatio)"
      :height="720"
      fit="fill"
      loading="eager"
      :placeholder="[Math.round(180 * activePhoto.aspectRatio), 180, 20, 25]"
      class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500 md:h-full md:w-auto" />
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>

<style scoped>
img {
  view-transition-name: selected-photo;
}
</style>
