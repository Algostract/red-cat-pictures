<script setup lang="ts">
const props = defineProps<{
  videos: Video[]
  activeCategory: Category
}>()

const featuredVideos = useTemplateRef<HTMLDivElement>('featured-videos')
const isAutoplay = shallowRef(false)
const isPlay = shallowRef(false)

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  isAutoplay.value = entry?.isIntersecting || false
  isPlay.value = isAutoplay.value
}

useIntersectionObserver(featuredVideos, onIntersectionObserver)

const isMuted = ref(true)

function toggleMute() {
  isMuted.value = !isMuted.value
}
const activeVideoIndex = ref(0)
const activeVideo = computed(() => ({ ...props.videos[activeVideoIndex.value]! }))
const activeVideoProgress = ref(0)

async function updateVideoIndex(step = 1) {
  const total = props.videos.length
  activeVideoProgress.value = 0
  activeVideoIndex.value = (activeVideoIndex.value + step + total) % total
}

const videoContainerRef = useTemplateRef<HTMLVideoElement>('videoContainerRef')

/* const videoRef = computed(() => videoContainerRef.value?.videoRef as HTMLVideoElement)
  const { isFullscreen, toggle } = useFullscreen(videoRef)

async function toggleFullScreen() {
  if (!videoRef.value) return
  await toggle()

  videoRef.value.muted = !isFullscreen.value
  videoRef.value.play()
} */
</script>

<template>
  <section id="featured-videos" ref="featured-videos" class="relative h-fit">
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
        :muted="isMuted"
        :playsinline="true"
        preload="metadata"
        class="aspect-video"
        @progress="(value) => (activeVideoProgress = value)"
        @ended="updateVideoIndex()"
        @click="toggleMute" />
      <!-- @click="toggleFullScreen()" -->
      <StatusBar :total="videos.length" :active-index="activeVideoIndex" :active-percent="activeVideoProgress" class="absolute left-1/2 top-4 z-0 -translate-x-1/2" />
      <ButtonSlide class="absolute bottom-8 left-1/2 z-0 -translate-x-1/2 md:bottom-12 md:left-16 md:translate-x-0" @click="(value) => updateVideoIndex(value === 'left' ? -1 : 1)" />
    </div>
  </section>
</template>
