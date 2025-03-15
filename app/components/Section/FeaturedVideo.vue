<script setup lang="ts">
const props = defineProps<{
  videos: Video[]
  activeCategory: Category
}>()

const activeVideoIndex = ref(0)
const activeVideo = computed(() => ({ ...props.videos[activeVideoIndex.value]! }))

async function updateVideoIndex() {
  activeVideoIndex.value = (activeVideoIndex.value + 1) % props.videos.length
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

const featuredVideos = useTemplateRef<HTMLDivElement>('featured-videos')
const isAutoplay = shallowRef(false)
const isPlay = shallowRef(false)

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  isAutoplay.value = entry?.isIntersecting || false
  isPlay.value = isAutoplay.value
  console.log({ isAutoplay: isAutoplay.value })
}

useIntersectionObserver(featuredVideos, onIntersectionObserver)
</script>

<template>
  <section id="featured-videos" ref="featured-videos" class="pb-4">
    <SectionLabel icon="movie" title="Featured Videos" />
    <div v-if="videos.length" class="relative left-1/2 flex h-screen w-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-black">
      <NuxtVideo
        ref="videoContainerRef"
        :key="activeVideoIndex"
        :poster="activeVideo.poster"
        :source="activeVideo.sources"
        :disable-picture-in-picture="true"
        controls-list="nodownload"
        :autoplay="isAutoplay"
        :state="isPlay ? 'play' : 'pause'"
        :muted="true"
        :playsinline="true"
        preload="metadata"
        class="aspect-video cursor-pointer"
        @ended="updateVideoIndex"
        @click="toggleFullScreen()" />
    </div>
  </section>
</template>
