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

function ceilToList(x: number, list: readonly number[]) {
  for (const n of list) if (x <= n) return n
  return list[list.length - 1] // clamp to max if beyond list
}

const qualtiy = 80
const { width, height } = useElementSize(videoRef)

// Source: common display/video resolutions (HD/Full HD/QHD/4K/8K)
const WIDTHS_16_9 = [1280, 1920, 2560] as const
const HEIGHTS_16_9 = [720, 1080, 1440] as const

function coverByAspect(orientation: 'auto' | 'landscape' | 'portrait', r: number = 16 / 9): string {
  const W = width.value
  const H = height.value
  const containerR = W / H

  // cover math: scale by width if container is wider than source ratio, else by height
  let rawW = containerR > r ? W : H * r
  let rawH = containerR > r ? W / r : H

  // Ensure orientation if explicitly requested
  if (orientation === 'landscape' && rawW < rawH) [rawW, rawH] = [rawH, rawW]
  if (orientation === 'portrait' && rawH < rawW) [rawW, rawH] = [rawH, rawW]

  // Decide which axis to snap:
  const snapByWidth = orientation === 'landscape' ? true : orientation === 'portrait' ? false : containerR > r

  let finalW: number
  let finalH: number

  if (snapByWidth) {
    const snappedW = ceilToList(Math.round(rawW), WIDTHS_16_9)!
    finalW = snappedW
    finalH = Math.round(snappedW / r)
  } else {
    const snappedH = ceilToList(Math.round(rawH), HEIGHTS_16_9)!
    finalH = snappedH
    finalW = Math.round(snappedH * r)
  }

  return `${finalW}x${finalH}`
}

const adaptivePoster = computed(() => {
  const orientation = width.value >= height.value ? 'landscape' : 'portrait'
  return props.poster ? `${cdnUrl}/image/fit_cover&w_1280/${extractCdnId(props.poster)!.replace(/\b(landscape|portrait)\b/i, orientation)}` : undefined
})
</script>

<template>
  <!-- @loadedmetadata="" -->
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
    @error="handleError()"
    @canplay="handleCanPlay"
    @play="handlePlay"
    @pause="handlePause"
    @timeupdate="handleProgress"
    @ended="handleEnded">
    <template v-if="Array.isArray(source)">
      <source
        v-for="{ src, type, media, codec, orientation } of source"
        :key="src"
        :src="`${cdnUrl}/video/s_${coverByAspect(orientation)}&c_${codec}&q_${qualtiy}/${src}`"
        :type="type"
        :media="media" />
    </template>
    <template v-else>
      <source :src="`${cdnUrl}/video/s_${coverByAspect(source.orientation)}&c_${source.codec}&q_${qualtiy}/${source.src}`" :type="source.type" />
    </template>
    Your browser does not support the video tag.
  </video>
</template>
