<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = route.params.slug!.toString()
const { data: videos } = await useAPI('/api/video', { default: () => [] })

const activeVideoSlug = computed<string>(() => slugify(slug))
const activeVideo = computed(() => videos.value.find(({ id }) => id === activeVideoSlug.value))

if (!activeVideo.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = `${activeVideo.value.title}`
const description = `${activeVideo.value.description}`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = activeVideo.value.poster

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/photo/${activeVideoSlug.value}`,
})

useSchemaOrg([
  defineVideo({
    name: title,
    description,
    thumbnailUrl: imageUrl,
  }),
])

const activeVideoIndex = ref(0)

async function updateVideoIndex() {
  activeVideoIndex.value = (activeVideoIndex.value + 1) % videos.value.length
}

const videoContainerRef = useTemplateRef<HTMLVideoElement>('videoContainerRef')
const videoRef = computed(() => videoContainerRef.value as HTMLVideoElement)
const { isFullscreen, toggle } = useFullscreen(videoRef)

async function toggleFullScreen() {
  if (!videoRef.value) return
  await toggle()

  videoRef.value.muted = !isFullscreen.value
  videoRef.value.play()
}
</script>

<template>
  <main v-if="activeVideo" class="relative mx-auto flex h-screen w-screen max-w-[90rem] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
    <NuxtVideo
      ref="videoContainerRef"
      :key="activeVideoSlug"
      :poster="activeVideo.poster"
      :source="activeVideo.sources"
      :disable-picture-in-picture="true"
      controls-list="nodownload"
      :autoplay="true"
      :muted="true"
      :playsinline="true"
      preload="metadata"
      class="aspect-video cursor-pointer"
      @ended="updateVideoIndex"
      @click="toggleFullScreen()" />
  </main>
</template>
