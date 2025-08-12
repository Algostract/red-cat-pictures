<script setup lang="ts">
const props = defineProps<{
  videos: Video[]
  activeCategory: Category
}>()

const featuredVideos = useTemplateRef<HTMLDivElement>('video-gallery')
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
const filterVideos = computed(() => props.videos.filter(({ featured }) => featured).toSorted((a, b) => a.featured! - b.featured!))

const activeVideoIndex = ref(0)
const activeVideo = computed(() => ({ ...filterVideos.value[activeVideoIndex.value]! }))
const activeVideoProgress = ref(0)

async function updateVideoIndex(step = 1) {
  const total = filterVideos.value.length
  activeVideoProgress.value = 0
  activeVideoIndex.value = (activeVideoIndex.value + step + total) % total
}

const videoContainerWrapper = useTemplateRef<HTMLDivElement>('video-container-wrapper')

const { orientation: deviceOrientation } = useScreenOrientation()

/*
const videoRef = computed(() => videoContainerRef.value?.videoRef as HTMLVideoElement)
const { isFullscreen, toggle } = useFullscreen(videoRef)

async function toggleFullScreen() {
  if (!videoRef.value) return
  await toggle()

  videoRef.value.muted = !isFullscreen.value
  videoRef.value.play()
}
*/

/*
device type | device orientation | video orientation | final orientation
width < height      | portrait           | portrait          | portrait
width < height      | portrait           | landscape         | landscape
width < height      | landscape          | portrait          | landscape
width < height      | landscape          | landscape         | landscape
width >= height     | landscape          | portrait          | portrait
width >= height     | landscape          | landscape         | landscape
*/
const { width, height } = useWindowSize()
const { x } = useMouseInElement(videoContainerWrapper)

function isLandscapeOriented(deviceOrientation: string, videoOrientation: string) {
  const deviceType = width.value > height.value
  if (deviceType) {
    return false
  } else {
    if (deviceOrientation === 'landscape' || videoOrientation === 'landscape') return true
    else return false
  }
}

const sliderIndicatorDirection = refAutoReset(0, 500) as Ref<-1 | 0 | 1>

function slideClick() {
  if (!videoContainerWrapper.value) return
  const width = videoContainerWrapper.value.clientWidth
  if (x.value < width * (1 / 4)) {
    updateVideoIndex(-1)
    sliderIndicatorDirection.value = -1
  } else if (x.value > width * (3 / 4)) {
    updateVideoIndex(1)
    sliderIndicatorDirection.value = 1
  }
}
</script>

<template>
  <section id="video-gallery" ref="video-gallery" class="relative -mx-2 h-fit w-[calc(100%+16px)]">
    <SectionLabel icon="movie" title="Video Gallery" />
    <div v-if="filterVideos.length" ref="video-container-wrapper" class="relative left-1/2 flex h-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-black">
      <ClientOnly>
        <NuxtVideo
          :key="activeVideoIndex"
          class="aspect-video"
          :class="isLandscapeOriented(deviceOrientation?.split('-')[0]!, activeVideo.sources[0]!.orientation) ? 'w-[100vh] max-w-[100vh] rotate-90' : ''"
          :poster="activeVideo.poster"
          :source="activeVideo.sources"
          :disable-picture-in-picture="true"
          controls-list="nodownload"
          :autoplay="isAutoplay"
          :state="isPlay ? 'play' : 'pause'"
          :muted="isMuted"
          :playsinline="true"
          preload="metadata"
          @progress="(value) => (activeVideoProgress = value)"
          @ended="updateVideoIndex()"
          @click="slideClick" />
      </ClientOnly>
      <!-- @click="toggleFullScreen()" -->
      <StatusBar :total="filterVideos.length" :active-index="activeVideoIndex" :active-percent="activeVideoProgress" class="absolute left-1/2 top-8 z-0 w-full -translate-x-1/2 px-4 md:px-16" />
      <ButtonSlide class="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 md:bottom-12 md:left-16 md:translate-x-0" @click="(value) => updateVideoIndex(value === 'left' ? -1 : 1)" />
      <NuxtIcon
        v-for="iconName in ['muted', 'unmuted']"
        :key="iconName"
        :name="`local:speaker-${iconName}`"
        class="absolute right-4 top-16 z-10 rounded-full bg-white fill-black p-1 text-[20px] md:right-16 md:text-[28px]"
        :class="{ hidden: isMuted ? iconName == 'unmuted' : iconName == 'muted' }"
        @click="toggleMute" />
      <Transition name="fade" mode="out-in" appear>
        <div
          v-if="!!sliderIndicatorDirection"
          class="absolute top-0 flex h-full w-1/4 items-center justify-center rounded-r-full bg-white/50"
          :class="[sliderIndicatorDirection === 1 ? 'right-0 scale-x-[-1]' : 'left-0']">
          <NuxtIcon name="local:chevron-bold" class="pr-1 text-[24px] md:text-[48px]" />
        </div>
      </Transition>
    </div>
  </section>
</template>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
