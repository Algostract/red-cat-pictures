<script setup lang="ts">
definePageMeta({
  layout: false,
})

const slugMap: Record<string, string> = {
  'product-009-001': 'ecommerce-001-001',
}

const route = useRoute()
const slug = route.params.slug!.toString()
const { data: photos } = await useFetch('/api/photo', { default: () => [] })

const activePhotoName = computed<string>(() => {
  const unmappedSlug = slugify(slug)
  if (slugMap[unmappedSlug]) return slugMap[unmappedSlug]

  return unmappedSlug
})
if (activePhotoName.value !== slug) {
  await navigateTo('/photo/' + activePhotoName.value, { redirectCode: 301 })
}

const activePhoto = computed(() => photos.value.find(({ id }) => id === activePhotoName.value))
if (!activePhoto.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = `${activePhotoName.value.charAt(0).toUpperCase() + activePhotoName.value.slice(1)}`
const description = `${activePhoto.value.description}`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `https://ucarecdn.com/${activePhoto.value.image}/-/format/auto/-/scale_crop/${Math.round(720 * activePhoto.value.aspectRatio)}x720/center`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/photo/${activePhotoName.value}`,
})

useSchemaOrg([
  defineImage({
    url: `${siteUrl}/photo/${activePhotoName.value}`,
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
      :placeholder="[Math.round(180 * activePhoto.aspectRatio), 180, 'lightest', 25]"
      class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500 md:h-full md:w-auto" />
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>

<style scoped>
img {
  view-transition-name: selected-photo;
}
</style>
