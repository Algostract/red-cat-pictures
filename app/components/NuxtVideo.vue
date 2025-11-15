<script setup lang="ts">
const {
  public: { cdnUrl },
} = useRuntimeConfig()

type Orientation = 'portrait' | 'landscape'

interface Source {
  src: string
  type: string
  media: string
  codec: Codec
  orientation: Orientation
  // resolution: Resolution
}

const props = withDefaults(
  defineProps<{
    source: Source | Source[]
    poster?: string
    controlsList?: string
    preload?: 'none' | 'metadata' | 'auto'
    controls?: boolean
    autoplay?: boolean
    state?: 'play' | 'pause' | 'stop'
    muted?: boolean
    playsinline?: boolean
    disablePictureInPicture?: boolean
  }>(),
  {
    poster: undefined,
    controlsList: undefined,
    preload: 'auto',
    controls: false,
    autoplay: false,
    state: 'stop',
    muted: false,
    playsinline: false,
    disablePictureInPicture: false,
  }
)

const emit = defineEmits<{
  started: []
  progress: [value: number]
  ended: []
}>()

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')

defineExpose({ videoRef })

/* onMounted(() => {
  videoRef.value!.playbackRate = 0.25;
}) */

watch(
  () => props.source,
  async () => {
    if (!videoRef.value) return

    videoRef.value.pause()
    videoRef.value.currentTime = 0
    await videoRef.value.play()
  }
)

watch(
  () => props.state,
  async (value) => {
    switch (value) {
      case 'play':
        await videoRef.value?.play()
        break
      case 'pause':
        videoRef.value?.pause()
        break
      case 'stop':
        videoRef.value?.pause()
        break
      default:
        break
    }
  }
)

const progress = ref(0)
const isVideoLoaded = ref(false)

function handleError(e?: Error) {
  console.error('Video Error occurred:', e)
}

function handleCanPlay() {
  // console.log('Video can start playing')
}

function handlePlay() {
  // console.log('Video played')
}

function handlePause() {
  // console.log('Video paused')
}

function handleLoadedData() {
  isVideoLoaded.value = true
}

function handleProgress() {
  if (!videoRef.value) return

  const { currentTime, duration } = videoRef.value
  if (duration > 0) {
    progress.value = currentTime / duration
    emit('progress', progress.value)
  }
}

function handleEnded() {
  progress.value = 1
  emit('progress', progress.value)
  emit('ended')
}

const qualtiy = 75
const { width, height } = useElementSize(videoRef)

// TODO: remove when hero video is same as landscape and portrait
const adaptivePoster = computed(() => {
  const orientation = width.value > height.value ? 'landscape' : 'portrait'
  return props.poster ? `${cdnUrl}/image/fit_cover&${orientation === 'portrait' ? 'h' : 'w'}_720/${extractCdnId(props.poster)}` : '/previews/placeholder-blank.webp'
})
</script>

<template>
  <video
    ref="videoRef"
    class="size-full bg-black"
    :poster="adaptivePoster"
    :controlsList="controlsList"
    :preload="preload"
    :controls="controls"
    :autoplay="autoplay"
    :muted="muted"
    :playsinline="playsinline"
    :disablePictureInPicture="disablePictureInPicture"
    :class="{ shimmer: !isVideoLoaded }"
    @error="handleError()"
    @canplay="handleCanPlay"
    @play="handlePlay"
    @pause="handlePause"
    @timeupdate="handleProgress"
    @ended="handleEnded"
    @loadeddata="handleLoadedData"
    @loadedmetadata="handleLoadedData">
    <template v-if="Array.isArray(source)">
      <source
        v-for="{ src, type, media, codec, orientation } of source"
        :key="src"
        :src="`${cdnUrl}/video/s_${videoFitCoverAspect(orientation, orientation === 'landscape' ? 16 / 9 : 9 / 16, width, height)}&c_${codec}&q_${qualtiy}/${src}`"
        :type="type"
        :media="media" />
    </template>
    <template v-else>
      <source
        :src="`${cdnUrl}/video/s_${videoFitCoverAspect(source.orientation, source.orientation === 'landscape' ? 16 / 9 : 9 / 16, width, height)}&c_${source.codec}&q_${qualtiy}/${source.src}`"
        :type="source.type" />
    </template>
    Your browser does not support the video tag.
  </video>
</template>
