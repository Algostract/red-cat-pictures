<script setup lang="ts">
interface Source {
  src: string
  type: string
}

const props = withDefaults(
  defineProps<{
    source: Source | Source[]
    poster?: string
    controlsList?: string
    preload?: 'none' | 'metadata' | 'auto'
    controls?: boolean
    autoplay?: boolean
    muted?: boolean
    playsinline?: boolean
    disablePictureInPicture?: boolean
  }>(),
  {
    poster: undefined,
    controlsList: undefined,
    preload: 'auto',
    controls: false,
    disablePictureInPicture: false,
    autoplay: false,
    muted: false,
    playsinline: false,
  }
)

const emit = defineEmits<{
  (event: 'ended'): void
}>()

const videoRef = ref<HTMLVideoElement>()

watch(
  () => props.source,
  async () => {
    if (!videoRef.value) return

    videoRef.value.pause()
    videoRef.value.currentTime = 0
    await videoRef.value.play()
  }
)

function handleError(e?: Error) {
  console.error('Video Error occurred:', e)
}

function handleCanPlay() {
  console.log('Video can start playing')
}

function handlePlay() {
  console.log('Video played')
}

function handlePause() {
  console.log('Video paused')
}

function handleProgress() {}

function handleEnded() {
  emit('ended')
}
</script>

<template>
  <!-- @loadedmetadata="" -->
  <video
    ref="videoRef"
    width="100%"
    height="100%"
    :poster="poster"
    :controlsList="controlsList"
    :preload="preload"
    :controls="controls"
    :autoplay="autoplay"
    :muted="muted"
    :playsinline="playsinline"
    :disablePictureInPicture="disablePictureInPicture"
    @error="handleError()"
    @canplay="handleCanPlay"
    @play="handlePlay"
    @pause="handlePause"
    @progress="handleProgress"
    @ended="handleEnded">
    <template v-if="Array.isArray(source)">
      <source v-for="{ src, type } of source" :key="src" :src="src" :type="type" />
    </template>
    <template v-else>
      <source :src="source.src" :type="source.type" />
    </template>
    Your browser does not support the video tag.
  </video>
</template>
