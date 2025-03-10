<script setup lang="ts">
const { data: photos } = await useFetch('/api/photo', { default: () => [] })

definePageMeta({
  layout: false,
})

const route = useRoute()

const activePhotoName = computed<string>(() => route.params.slug![0]!)
const activePhoto = computed(() => photos.value.find(({ name }) => name === activePhotoName.value))

const title = `${activePhotoName.value}`
const description = `${activePhoto.value?.description}`
const url = 'https://redcatpictures.com'
const imageUrl = `https://ucarecdn.com/${activePhoto.value?.id}/-/format/jpeg/-/preview/1280x640/-/smart_resize/1280x640/center`

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
</script>

<template>
  <div v-if="activePhoto">
    <main class="relative mx-auto flex h-screen w-screen max-w-[90rem] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
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
  </div>
</template>
