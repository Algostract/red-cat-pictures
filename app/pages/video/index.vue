<script setup lang="ts">
const { data: videos } = await useFetch('/api/video', { default: () => [] })

definePageMeta({
  layout: false,
})

if (!videos.value[0]) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = `Videos`
const description = `Video Gallery`
const url = 'https://redcatpictures.com'
const imageUrl = `https://ucarecdn.com/${videos.value[0].id}/-/format/auto/-/scale_crop/${Math.round(720 * videos.value[0].aspectRatio)}x720/center`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${url}/photo`,
})
</script>

<template>
  <main class="relative mx-auto flex h-screen w-screen max-w-[90rem] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
    <!--  <NuxtVideo ref="videoContainerRef" :key="activeVideoName" :poster="activeVideo.poster" :source="activeVideo.sources"
      :disable-picture-in-picture="true" controls-list="nodownload" :autoplay="true" :muted="true" :playsinline="true"
      preload="metadata" class="aspect-video cursor-pointer" @ended="updateVideoIndex" @click="toggleFullScreen()" /> -->
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>
