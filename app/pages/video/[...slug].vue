<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = route.params.slug!.toString()
const { data: videos } = await useFetch('/api/video', { default: () => [] })

const activeVideoName = computed<string>(() => slugify(slug))
const activeVideo = computed(() => videos.value.find(({ id }) => id === activeVideoName.value))

if (!activeVideo.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (activeVideoName.value !== slug) {
  await navigateTo('/video/' + activeVideoName.value, { redirectCode: 301 })
}

const title = `${activeVideoName.value}`
const description = `${activeVideo.value.description}`
const url = 'https://redcatpictures.com'
const imageUrl = `https://ucarecdn.com/${activeVideo.value.id}/-/format/auto/-/scale_crop/${Math.round(720 * activeVideo.value.aspectRatio)}x720/center`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${url}/photo/${activeVideoName.value}`,
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
const videoRef = computed(() => videoContainerRef.value?.videoRef as HTMLVideoElement)
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
      :key="activeVideoName"
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
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>
