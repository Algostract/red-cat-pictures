<script setup lang="ts">
const props = defineProps<{
  videos: VideoItem[]
  activeCategory: Category
}>()

const currentVideoIndex = ref(0)
const currentVideo = computed(() => ({ ...props.videos[currentVideoIndex.value]! }))

async function updateVideoIndex() {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % props.videos.length
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
  <section id="featured-videos" class="pb-4">
    <SectionLabel icon="movie" title="Featured Videos" />
    <div v-if="videos.length" class="relative left-1/2 flex h-screen w-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-black">
      <NuxtVideo
        ref="videoContainerRef"
        :key="currentVideoIndex"
        :poster="currentVideo.poster"
        :source="currentVideo.sources"
        :disable-picture-in-picture="true"
        controls-list="nodownload"
        :autoplay="true"
        :muted="true"
        :playsinline="true"
        preload="metadata"
        class="aspect-video cursor-pointer"
        @ended="updateVideoIndex"
        @click="toggleFullScreen()" />
    </div>
  </section>
</template>
