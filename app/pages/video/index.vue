<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { data: videos } = await useAPI('/api/video', { default: () => [] })

if (!videos.value[0]) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const title = `Videos`
const description = `Video Gallery`
const {
  public: { siteUrl, cdnUrl },
} = useRuntimeConfig()
const imageUrl = videos.value?.length ? `${cdnUrl}/image/fit_cover&w_1200&h_630/${extractCdnId(videos.value[0].poster)}` : `${siteUrl}/preview/placeholder-empty.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/video`,
})
</script>

<template>
  <main class="relative mx-auto flex h-screen w-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8">
    <!--  <NuxtVideo ref="videoContainerRef" :key="activeVideoName" :poster="activeVideo.poster" :source="activeVideo.sources"
      :disable-picture-in-picture="true" controls-list="nodownload" :autoplay="true" :muted="true" :playsinline="true"
      preload="metadata" class="aspect-video cursor-pointer" @ended="updateVideoIndex" @click="toggleFullScreen()" /> -->
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>
