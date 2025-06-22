<script setup lang="ts">
import heroVideoEffect from '~~/app/assets/videos/effect-1.webm'
type SocialPlatforms = 'facebook' | 'instagram' | 'youtube' | 'x' | 'linkedin' | 'website'

export interface Member {
  name: string
  designation: string
  content: string
  image: string
  socials: Partial<Record<SocialPlatforms, string>>
  isHero: boolean
}

const props = defineProps<Member>()

const platforms: Record<
  SocialPlatforms,
  {
    icon: string
    color: string
  }
> = {
  facebook: { icon: 'local:facebook', color: '#1877F2' },
  instagram: { icon: 'local:instagram', color: '#405DE6' },
  youtube: { icon: 'local:youtube', color: '#FF0000' },
  x: { icon: 'local:x', color: '#000000' },
  linkedin: { icon: 'local:linkedin', color: '#0A66C2' },
  website: { icon: 'mdi:web', color: '#1DA1F2' },
}

const links = computed(() =>
  Object.entries(props.socials).map(([platform, url]) => ({
    visible: !!url.length,
    url,
    platform,
    icon: platforms[platform as SocialPlatforms].icon,
    color: '#1DA1F2',
  }))
)

/* Animation */
const wrapper = useTemplateRef<HTMLDivElement>('wrapper')
const heroMaskCanvas = useTemplateRef<HTMLCanvasElement>('hero-mask-canvas')
const offscreenCanvas = useTemplateRef<HTMLCanvasElement>('offscreen-canvas')
const heroImage = useTemplateRef<HTMLImageElement>('hero-image')
const heroMaskVideo = useTemplateRef<HTMLVideoElement>('hero-mask-video')
const isHovered = useElementHover(wrapper)

function renderFrame() {
  if (!(heroMaskVideo.value && heroMaskCanvas.value && offscreenCanvas.value && heroImage.value)) return

  const vid = heroMaskVideo.value
  const cvs = heroMaskCanvas.value
  const ctx = cvs.getContext('2d')!
  const offscreenCvs = offscreenCanvas.value
  const offscreenCtx = offscreenCvs.getContext('2d')!
  if (vid.paused || vid.ended) return

  const w = cvs.width,
    h = cvs.height

  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(heroImage.value, 0, 0, w, h)

  offscreenCtx.drawImage(heroMaskVideo.value, 0, 0, w, h)

  const imgData = ctx.getImageData(0, 0, w, h)
  const maskData = offscreenCtx.getImageData(0, 0, w, h)

  for (let i = 0; i < maskData.data.length; i += 4) {
    const sR = imgData.data[i]!
    const sG = imgData.data[i + 1]!
    const sB = imgData.data[i + 2]!
    // const _sA = imgData.data[i + 3]!;
    const tR = maskData.data[i]!
    const tG = maskData.data[i + 1]!
    const tB = maskData.data[i + 2]!
    // const _tA = maskData.data[i + 3]!;
    const alpha = (tR + tG + tB) / (3 * 255)
    imgData.data[i] = (tR * (1 - alpha) + sR * alpha * 2) / 2
    imgData.data[i + 1] = (tG * (1 - alpha) + sG * alpha * 2) / 2
    imgData.data[i + 2] = (tB * (1 - alpha) + sB * alpha * 2) / 2
    imgData.data[i + 3] = Math.round(alpha * 255)
  }

  ctx.putImageData(imgData, 0, 0)

  requestAnimationFrame(renderFrame)
}

onMounted(() => {
  if (!(heroMaskVideo.value && heroMaskCanvas.value && offscreenCanvas.value)) return

  const vid = heroMaskVideo.value
  const cvs = heroMaskCanvas.value
  const offscreenCvs = offscreenCanvas.value

  const { width: cssW, height: cssH } = cvs.getBoundingClientRect()

  const dpr = window.devicePixelRatio || 1
  offscreenCvs.width = cvs.width = Math.round(cssW * dpr)
  offscreenCvs.height = cvs.height = Math.round(cssH * dpr)

  vid.addEventListener('play', () => {
    requestAnimationFrame(renderFrame)
  })

  vid.addEventListener('ended', () => {
    vid.currentTime = 0
  })
})

watch(isHovered, (value) => {
  if (!heroMaskVideo.value) {
    return
  }

  if (!value) {
    heroMaskVideo.value.pause()
    heroMaskVideo.value.currentTime = 0
    return
  }
  heroMaskVideo.value.play()
})
</script>

<template>
  <div class="h-fit max-w-full overflow-hidden" :class="{ 'md:max-w-[405px]': !isHero }">
    <div ref="wrapper" class="relative aspect-square w-full overflow-hidden rounded-md">
      <canvas ref="hero-mask-canvas" class="pointer-events-none absolute inset-0 z-20 aspect-[2/3] w-full" />
      <img
        ref="hero-image"
        :src="image"
        :alt="`${name}, ${designation}`"
        :width="512"
        :height="Math.round(512 / (2 / 3))"
        class="absolute inset-0 z-10 h-full w-full object-cover object-top grayscale filter" />
      <canvas ref="offscreen-canvas" class="hidden aspect-[2/3] w-full" />
      <video ref="hero-mask-video" :src="heroVideoEffect" muted preload="auto" playsinline class="hidden" />
    </div>
    <div>
      <h2 class="pt-6 text-xl font-semi-bold md:pt-8 md:text-2xl">{{ name }}</h2>
      <p class="pt-1.5 text-lg font-semi-bold text-primary-500 md:pt-3 md:text-xl">{{ designation }}</p>
      <p class="pt-1.5 text-base font-semi-bold !leading-relaxed md:pt-3 md:text-lg">{{ content }}</p>
      <div class="flex gap-4 pt-6 md:pt-12">
        <template v-for="{ visible, platform, url, icon, color } in links" :key="platform">
          <NuxtLink v-if="visible" :to="url" external target="_blank" rel="noopener" :aria-label="platform" class="transition-colors ease-out" :class="`hover:text-[${color}]`">
            <NuxtIcon :name="icon" class="text-[36px]" />
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* .profile-photo {
  clip-path: circle(0% at 50% 50%);
}

.profile-photo-wrapper:hover .profile-photo {
  clip-path: circle(150% at 50% 50%);
} */
</style>
