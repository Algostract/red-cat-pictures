<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = route.params.slug!.toString()
const { data: photos } = await useFetch('/api/photo', { default: () => [] })

const activePhoto = computed(() => photos.value.find(({ name }) => name === activePhotoName.value))

const activePhotoName = computed<string>(() => slugify(slug))

if (!activePhoto.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (activePhotoName.value !== slug) {
  await navigateTo('/photo/' + activePhotoName.value, { redirectCode: 301 })
}

const title = `${activePhotoName.value.charAt(0).toUpperCase() + activePhotoName.value.slice(1)}`
const description = `${activePhoto.value.description}`
const url = 'https://redcatpictures.com'
const imageUrl = `https://ucarecdn.com/${activePhoto.value.id}/-/format/auto/-/scale_crop/${Math.round(720 * activePhoto.value.aspectRatio)}x720/center`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${url}/photo/${activePhotoName.value}`,
})

useSchemaOrg([
  defineImage({
    url: `${url}/photo/${activePhotoName.value}`,
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
          <ButtonColorMode />
        </div>
      </nav>
    </header>
    <!-- App Header -->
    <NuxtImg
      provider="uploadcare"
      :src="activePhoto.id"
      :alt="activePhoto.description"
      :width="Math.round(720 * activePhoto.aspectRatio)"
      :height="720"
      fit="fill"
      format="auto"
      loading="lazy"
      class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500 md:h-full md:w-auto" />
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>

<style scoped>
img {
  view-transition-name: selected-photo;
}
</style>
