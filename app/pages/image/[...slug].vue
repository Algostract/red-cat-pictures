<script setup lang="ts">
const { data: images } = await useFetch('/api/image', { default: () => [] })

definePageMeta({
  layout: false,
})

const route = useRoute()

const activeImageName = computed<string>(() => route.params.slug![0]!)
const activeImage = computed(() => images.value.find(({ name }) => name === activeImageName.value))

const title = `${activeImageName.value}`
const description = `${activeImage.value?.description}`
const url = 'https://redcatpictures.com'
const imageUrl = `https://ucarecdn.com/${activeImage.value?.id}/-/format/auto/-/preview/1280x640/-/smart_resize/1280x640/center`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${url}/image/${activeImageName.value}`,
})
</script>

<template>
  <div v-if="activeImage">
    <main class="relative mx-auto flex h-screen w-screen max-w-[90rem] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      <NuxtImg
        provider="uploadcare"
        :src="activeImage.id"
        :alt="activeImage.title"
        :width="Math.round(720 * activeImage.aspectRatio)"
        :height="720"
        fit="fill"
        format="auto"
        loading="lazy"
        class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500 md:h-full md:w-auto" />
      <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
    </main>
  </div>
</template>
