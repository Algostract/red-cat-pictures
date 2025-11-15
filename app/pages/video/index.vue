<script setup lang="ts">
const { data: videos } = await useAPI('/api/video', { default: () => [] })

if (!videos.value[0]) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const title = `Videos`
const description = `Video Gallery`
const {
  public: { siteUrl, cdnUrl },
} = useRuntimeConfig()
const imageUrl = videos.value?.length ? `${cdnUrl}/image/fit_cover&s_1200x630/${extractCdnId(videos.value[0].poster)}` : `${siteUrl}/preview/placeholder-empty.webp`

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

const activeVideoName = useState<string | null>()
// Split videos into reels (portrait) and landscape
const reels = computed(() => videos.value.filter((v) => v.sources[0]?.orientation === 'portrait' && v.title !== 'featured-video-000-000'))
const landscapeVideos = computed(() => videos.value.filter((v) => v.sources[0]?.orientation !== 'portrait' && v.title !== 'featured-video-000-000'))
</script>

<template>
  <main class="mx-auto min-h-screen w-fit pt-20 md:pt-28">
    <section class="flex w-full flex-col items-center gap-3">
      <!-- Reels Grid (5 per row) -->
      <h2 class="font-semibold text-md text-center uppercase md:text-xl">Portrait</h2>
      <div class="grid grid-cols-3 gap-2 md:grid-cols-5 lg:grid-cols-7">
        <div
          v-for="video in reels"
          :key="video.id"
          class="group relative flex aspect-[9/16] w-full flex-col overflow-hidden border border-dark-500 shadow transition-all duration-150 hover:border-primary-500">
          <NuxtLink
            :to="video.url"
            class="relative size-full transition-colors duration-150"
            @mouseenter="activeVideoName = video.title"
            @mouseleave="activeVideoName = null"
            @click="activeVideoName = video.title">
            <NuxtVideo
              :source="video.sources"
              :poster="video.poster"
              :autoplay="activeVideoName === video.title"
              :state="activeVideoName === video.title ? 'play' : 'pause'"
              :muted="true"
              :playsinline="true"
              :controls="false"
              :disable-picture-in-picture="true"
              controls-list="nodownload"
              preload="metadata"
              class="size-full object-cover" />
          </NuxtLink>
        </div>
      </div>
      <!-- Landscape Videos Grid (3 per row) -->
      <h2 class="font-semibold text-md text-center uppercase md:text-xl">Landscape</h2>
      <div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="video in landscapeVideos"
          :key="video.id"
          class="group relative flex aspect-video w-full flex-col overflow-hidden border border-dark-500 shadow transition-all duration-150 hover:border-primary-500">
          <NuxtLink
            :to="video.url"
            class="relative size-full transition-colors duration-150"
            @mouseenter="activeVideoName = video.title"
            @mouseleave="activeVideoName = null"
            @click="activeVideoName = video.title">
            <NuxtVideo
              :source="video.sources"
              :poster="video.poster"
              :autoplay="activeVideoName === video.title"
              :state="activeVideoName === video.title ? 'play' : 'pause'"
              :muted="true"
              :playsinline="true"
              :controls="false"
              :disable-picture-in-picture="true"
              controls-list="nodownload"
              preload="metadata"
              class="size-full object-cover" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </main>
</template>
