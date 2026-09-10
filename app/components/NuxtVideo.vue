<script setup lang="ts">
import type { MediaPlayerClass, Representation } from 'dashjs'

let customElementsPromise: Promise<void> | null = null

function ensureVideoCustomElementsRegistered(): Promise<void> {
  if (!customElementsPromise) {
    customElementsPromise = Promise.all([
      import('@videojs/html/video/minimal-skin'),
      import('@videojs/html/video/player'),
      import('@videojs/html/media/dash-video'),
      import('@videojs/html/media/hlsjs-video'),
      // ?raw tells Vite to skip PostCSS and transformers entirely
      import('@videojs/html/video/minimal-skin.css?raw').then((cssModule) => {
        if (typeof document !== 'undefined' && !document.getElementById('vjs-skin-styles')) {
          const style = document.createElement('style')
          style.id = 'vjs-skin-styles'
          style.textContent = cssModule.default
          document.head.appendChild(style)
        }
      }),
    ]).then(() => undefined)
  }
  return customElementsPromise
}

const DASH_EVENTS = {
  STREAM_INITIALIZED: 'streamInitialized',
} as const

const HLS_EVENTS = {
  MANIFEST_PARSED: 'hlsManifestParsed',
  LEVEL_SWITCHED: 'hlsLevelSwitched',
} as const

const {
  public: { cdnUrl },
} = useRuntimeConfig()

const AUTO_QUALITY = 'auto'

const HEIGHT_TO_QUALITY: Record<number, string> = {
  2160: '2160p',
  1080: '1080p',
  720: '720p',
  480: '480p',
}

function heightToQualityLabel(height: number | undefined, bandwidthOrBitrate: number): string {
  if (height && HEIGHT_TO_QUALITY[height]) return HEIGHT_TO_QUALITY[height]
  return `${Math.round(bandwidthOrBitrate / 1000)}k`
}

interface QualityOption {
  label: string
  index: number
  bitrate: number
}

interface HlsLikeEngine {
  levels: Array<{ height?: number; bitrate: number }>
  currentLevel: number
  on(event: string, cb: (...args: unknown[]) => void): void
  off(event: string, cb: (...args: unknown[]) => void): void
}

interface MediaEngineElement extends HTMLElement {
  engine?: MediaPlayerClass | HlsLikeEngine
  play(): Promise<void>
  pause(): void
  currentTime: number
  duration: number
  paused: boolean
  seekable: TimeRanges
  error?: MediaError | null
}

type Orientation = 'portrait' | 'landscape'
type MediaKind = 'dash' | 'hls' | 'native'

const props = withDefaults(
  defineProps<{
    media?: string
    multiOrientation?: boolean
    aspectRatio?: number
    poster?: string
    preload?: 'none' | 'metadata' | 'auto'
    controls?: boolean
    autoplay?: boolean
    loop?: boolean
    state?: 'play' | 'pause' | 'stop'
    muted?: boolean
    playsinline?: boolean
    disablePictureInPicture?: boolean
    live?: boolean
    objectFit?: 'auto' | 'cover' | 'contain' | 'fill'
    cssClass?: string
  }>(),
  {
    media: undefined,
    multiOrientation: false,
    aspectRatio: 16 / 9,
    poster: undefined,
    preload: 'auto',
    controls: false,
    autoplay: false,
    loop: false,
    state: 'stop',
    muted: false,
    playsinline: false,
    disablePictureInPicture: false,
    live: false,
    objectFit: 'auto',
    cssClass: '',
  }
)

const emit = defineEmits<{
  started: []
  buffer: [value: number]
  progress: [value: number]
  ended: []
  ready: []
  atLive: [value: boolean]
  qualityChange: [quality: string]
  error: [error: MediaError | undefined]
  autoplayMuted: []
}>()

const baseUrl = computed(() => (props.media?.startsWith('/') ? '' : cdnUrl))
const wrapperRef = useTemplateRef<HTMLElement>('wrapperRef')
const videoRef = useTemplateRef<MediaEngineElement>('videoRef')

const pendingSeekTime = ref<number | null>(null)
const pendingPlayState = ref<boolean>(false)
const isVideoLoaded = ref(false)
const isPlaying = ref(false)
const customElementsReady = ref(false)
const progress = ref(0)
const lastAtLive = ref<boolean | null>(null)

const availableQualities = ref<QualityOption[]>([])
const selectedQuality = ref<string>(AUTO_QUALITY)
const showQualityMenu = ref(false)

const { width, height } = useElementSize(wrapperRef)

const hasMeasuredSize = computed(() => width.value > 0 && height.value > 0)
const currentOrientation = computed<Orientation>(() => {
  if (hasMeasuredSize.value) {
    return width.value > height.value ? 'landscape' : 'portrait'
  }
  return props.aspectRatio ? 'landscape' : 'portrait'
})

const activeSource = computed(() => {
  if (!props.media) return undefined
  return props.multiOrientation ? `${props.media}-${currentOrientation.value}` : props.media
})

const videoUrl = computed(() => {
  if (!activeSource.value) return ''
  const base = baseUrl.value.replace(/\/+$/, '')
  const source = activeSource.value.replace(/^\/+/, '')
  return `${base}/media/video/s_720-1920/${source}.mpd`
})

const mediaKind = computed<MediaKind>(() => {
  const raw = videoUrl.value
  if (!raw) return 'native'

  let pathname = raw.toLowerCase()
  try {
    pathname = new URL(raw, typeof window !== 'undefined' ? window.location.href : undefined).pathname.toLowerCase()
  } catch {
    // fallback to string check
  }

  if (pathname.endsWith('.mpd')) return 'dash'
  if (pathname.endsWith('.m3u8')) return 'hls'
  return 'native'
})

// Match the registered custom element tag from @videojs/html/media/hlsjs-video
const mediaTag = computed(() => {
  switch (mediaKind.value) {
    case 'dash':
      return 'dash-video'
    case 'hls':
      return 'hlsjs-video'
    default:
      return 'video'
  }
})

const objectFitStyle = computed(() => {
  const style: Record<string, string> = {
    aspectRatio: props.aspectRatio.toString(),
  }

  if (props.objectFit !== 'auto') {
    return { ...style, '--media-object-fit': props.objectFit, '--media-object-position': 'center' }
  }

  return style
})

watch(videoUrl, (newUrl, oldUrl) => {
  const el = videoRef.value
  if (!el || newUrl === oldUrl || !oldUrl) return
  pendingSeekTime.value = el.currentTime
  pendingPlayState.value = !el.paused

  availableQualities.value = []
  selectedQuality.value = AUTO_QUALITY
  showQualityMenu.value = false
})

function loadDashQualities(el: MediaEngineElement) {
  const engine = el.engine as MediaPlayerClass | undefined
  if (!engine) return
  const reps: Representation[] = engine.getRepresentationsByType('video')

  availableQualities.value = reps
    .slice()
    .sort((a, b) => b.bandwidth - a.bandwidth)
    .map((r) => ({
      label: heightToQualityLabel(r.height, r.bandwidth),
      index: r.index,
      bitrate: r.bandwidth,
    }))
  selectedQuality.value = AUTO_QUALITY
}

function loadHlsQualities(el: MediaEngineElement) {
  const engine = el.engine as HlsLikeEngine | undefined
  if (!engine?.levels) return

  availableQualities.value = engine.levels
    .map((level, index) => ({
      label: heightToQualityLabel(level.height, level.bitrate),
      index,
      bitrate: level.bitrate,
    }))
    .sort((a, b) => b.bitrate - a.bitrate)
  selectedQuality.value = AUTO_QUALITY
}

function syncHlsSelectedQuality(el: MediaEngineElement) {
  const engine = el.engine as HlsLikeEngine | undefined
  if (!engine) return
  if (engine.currentLevel === -1) {
    selectedQuality.value = AUTO_QUALITY
  }
}

function applyQuality(q: string) {
  const el = videoRef.value
  if (!el?.engine) return

  if (mediaKind.value === 'dash') {
    const engine = el.engine as MediaPlayerClass
    if (q === AUTO_QUALITY) {
      engine.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: true } } } })
    } else {
      const option = availableQualities.value.find((o) => o.label === q)
      if (!option) return
      engine.updateSettings({ streaming: { abr: { autoSwitchBitrate: { video: false } } } })
      engine.setRepresentationForTypeByIndex('video', option.index)
    }
  } else if (mediaKind.value === 'hls') {
    const engine = el.engine as HlsLikeEngine
    if (q === AUTO_QUALITY) {
      engine.currentLevel = -1
    } else {
      const option = availableQualities.value.find((o) => o.label === q)
      if (!option) return
      engine.currentLevel = option.index
    }
  } else {
    return
  }

  selectedQuality.value = q
  showQualityMenu.value = false
  emit('qualityChange', q)
}

function waitForEngine(el: MediaEngineElement, timeoutMs = 8000): Promise<MediaPlayerClass | HlsLikeEngine | undefined> {
  if (el.engine) return Promise.resolve(el.engine)
  return new Promise((resolve) => {
    const start = performance.now()
    function check() {
      if (el.engine) {
        resolve(el.engine)
      } else if (performance.now() - start > timeoutMs) {
        resolve(undefined)
      } else {
        requestAnimationFrame(check)
      }
    }
    check()
  })
}

async function attemptPlay(el: MediaEngineElement) {
  try {
    await el.play()
  } catch {
    if (!el.muted) {
      el.muted = true
      try {
        await el.play()
        emit('autoplayMuted')
      } catch {
        // Playback completely blocked
      }
    }
  }
}

function seekToLive() {
  const el = videoRef.value
  if (!el) return
  if (el.seekable.length > 0) {
    el.currentTime = el.seekable.end(el.seekable.length - 1)
  } else if (isFinite(el.duration)) {
    el.currentTime = el.duration
  }
}

defineExpose({ videoRef, seekToLive, applyQuality })

watch(
  () => props.state,
  async (value) => {
    const el = videoRef.value
    if (!el) return
    switch (value) {
      case 'play':
        await el.play()
        break
      case 'pause':
        el.pause()
        break
      case 'stop':
        el.pause()
        el.currentTime = 0
        break
    }
  }
)

function handleCanPlay() {
  isVideoLoaded.value = true
  emit('ready')

  const el = videoRef.value
  if (!el) return

  if (pendingSeekTime.value !== null) {
    el.currentTime = pendingSeekTime.value
    pendingSeekTime.value = null
  }
  if (pendingPlayState.value) {
    attemptPlay(el)
    pendingPlayState.value = false
  } else if (props.autoplay && el.paused) {
    attemptPlay(el)
  }
  if (props.live) seekToLive()
}

watch(videoRef, async (el, _, onCleanup) => {
  if (!el || !import.meta.client) return

  if (mediaKind.value === 'native') {
    availableQualities.value = []
    return
  }

  await ensureVideoCustomElementsRegistered()
  const engine = await waitForEngine(el)
  if (!engine) return

  if (mediaKind.value === 'dash') {
    const dashEngine = engine as MediaPlayerClass
    const onStreamInitialized = () => loadDashQualities(el)
    dashEngine.on(DASH_EVENTS.STREAM_INITIALIZED, onStreamInitialized)
    onCleanup(() => {
      dashEngine.off(DASH_EVENTS.STREAM_INITIALIZED, onStreamInitialized)
    })
  } else if (mediaKind.value === 'hls') {
    const hlsEngine = engine as HlsLikeEngine
    const onManifestParsed = () => loadHlsQualities(el)
    const onLevelSwitched = () => syncHlsSelectedQuality(el)
    hlsEngine.on(HLS_EVENTS.MANIFEST_PARSED, onManifestParsed)
    hlsEngine.on(HLS_EVENTS.LEVEL_SWITCHED, onLevelSwitched)
    onCleanup(() => {
      hlsEngine.off(HLS_EVENTS.MANIFEST_PARSED, onManifestParsed)
      hlsEngine.off(HLS_EVENTS.LEVEL_SWITCHED, onLevelSwitched)
    })
  }
})

function handlePlay() {
  isPlaying.value = true
  emit('started')
}

function handlePause() {
  isPlaying.value = false
}

function handleTimeUpdate(event: Event) {
  const el = event.target as MediaEngineElement
  if (el.duration > 0) {
    progress.value = el.currentTime / el.duration
    emit('progress', progress.value)
    if (props.live && el.seekable.length > 0) {
      const liveEdge = el.seekable.end(el.seekable.length - 1)
      const atLive = liveEdge - el.currentTime <= 2
      if (lastAtLive.value !== atLive) {
        lastAtLive.value = atLive
        emit('atLive', atLive)
      }
    }
  }
}

function handleEnded() {
  progress.value = 1
  emit('progress', 1)
  emit('ended')

  if (props.loop) {
    const el = videoRef.value
    if (el) {
      el.currentTime = 0
      el.play()
    }
  }
}

function handleError(event: Event) {
  const el = event.target as MediaEngineElement
  const error = el?.error ?? undefined
  console.error('[VideoPlayer] media error', error ?? event)
  emit('error', error)
}

onMounted(async () => {
  await ensureVideoCustomElementsRegistered()
  customElementsReady.value = true
})
</script>

<template>
  <div ref="wrapperRef" :class="['group relative flex size-full items-center justify-center', cssClass]" :style="objectFitStyle" @click.self="showQualityMenu = false">
    <ClientOnly>
      <img v-if="!customElementsReady && poster" :src="poster" class="absolute inset-0 size-full object-cover" alt="" />

      <video-player v-if="customElementsReady" class="size-full" :class="{ shimmer: !isVideoLoaded && !poster }">
        <video-minimal-skin v-if="controls" class="size-full">
          <component
            :is="mediaTag"
            ref="videoRef"
            class="size-full"
            :src="videoUrl"
            :poster="poster"
            :preload="preload"
            :autoplay="autoplay"
            :loop="loop"
            :muted="muted"
            :playsinline="playsinline"
            :disablepictureinpicture="disablePictureInPicture"
            :stream-type="mediaKind !== 'native' ? (live ? 'live' : 'on-demand') : undefined"
            crossorigin
            @play="handlePlay"
            @pause="handlePause"
            @canplay="handleCanPlay"
            @timeupdate="handleTimeUpdate"
            @ended="handleEnded"
            @error="handleError"
            @contextmenu.prevent />
        </video-minimal-skin>

        <media-container v-else class="size-full">
          <component
            :is="mediaTag"
            ref="videoRef"
            class="size-full"
            :src="videoUrl"
            :poster="poster"
            :preload="preload"
            :autoplay="autoplay"
            :loop="loop"
            :muted="muted"
            :playsinline="playsinline"
            :disablepictureinpicture="disablePictureInPicture"
            :stream-type="mediaKind !== 'native' ? (live ? 'live' : 'on-demand') : undefined"
            crossorigin
            @play="handlePlay"
            @pause="handlePause"
            @canplay="handleCanPlay"
            @timeupdate="handleTimeUpdate"
            @ended="handleEnded"
            @error="handleError"
            @contextmenu.prevent />
        </media-container>
      </video-player>

      <div v-if="controls && availableQualities.length" class="absolute bottom-3 right-3 z-10">
        <button
          type="button"
          class="rounded bg-black/60 px-2 py-1 text-xs text-white opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
          @click="showQualityMenu = !showQualityMenu">
          {{ selectedQuality === AUTO_QUALITY ? 'Auto' : selectedQuality }}
        </button>
        <ul v-if="showQualityMenu" class="absolute bottom-full right-0 mb-1 min-w-24 rounded bg-black/80 py-1 text-xs text-white shadow-lg">
          <li>
            <button type="button" class="block w-full px-3 py-1 text-left hover:bg-white/10" :class="{ 'font-semibold': selectedQuality === AUTO_QUALITY }" @click="applyQuality(AUTO_QUALITY)">
              Auto
            </button>
          </li>
          <li v-for="option in availableQualities" :key="option.label">
            <button type="button" class="block w-full px-3 py-1 text-left hover:bg-white/10" :class="{ 'font-semibold': selectedQuality === option.label }" @click="applyQuality(option.label)">
              {{ option.label }}
            </button>
          </li>
        </ul>
      </div>
    </ClientOnly>
  </div>
</template>

<style>
video-player,
video-minimal-skin,
media-container,
dash-video,
hlsjs-video,
video-player video,
video-minimal-skin video,
media-container video,
dash-video video,
hlsjs-video video,
video {
  border-radius: 0 !important;
  border-width: 0 !important;
}

video-player,
video-minimal-skin {
  --media-border-radius: 0;
  --vjs-border-radius: 0;
}

.group {
  overflow: hidden;
  border-radius: 0;
}
</style>
