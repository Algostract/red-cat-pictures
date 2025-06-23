<script setup lang="ts">
import reglConstructor from 'regl'
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

const isAnimated = ref(false)

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
const heroMaskCanvas = useTemplateRef<HTMLCanvasElement>('hero-mask-canvas')
const heroImage = useTemplateRef<HTMLImageElement>('hero-image')
const heroMaskVideo = useTemplateRef<HTMLVideoElement>('hero-mask-video')

let regl: reglConstructor.Regl | undefined
let drawBlend: reglConstructor.DrawCommand<reglConstructor.DefaultContext> | undefined

function initRenderFunction() {
  if (drawBlend || !regl) return
  const maskTex = regl.texture({ data: heroMaskVideo.value, flipY: true })
  const imageTex = regl.texture({ data: heroImage.value, flipY: true })

  drawBlend = regl({
    framebuffer: null,
    attributes: {
      position: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
    },
    uniforms: {
      src: imageTex,
      mask: () => {
        maskTex({ data: heroMaskVideo.value })
        return maskTex
      },
    },
    vert: `
       precision mediump float;
       attribute vec2 position;
       varying   vec2 uv;
       void main() {
         uv = position * 0.5 + 0.5;
         gl_Position = vec4(position, 0, 1);
       }`,
    frag: `
       precision mediump float;
       uniform sampler2D src, mask;
       varying vec2 uv;
       void main() {
         vec4 s = texture2D(src,  uv);
          vec4 m = texture2D(mask, uv);
          float alpha = (m.r + m.g + m.b) / 3.0;
          vec3 col = mix(m.rgb, s.rgb, alpha);
          gl_FragColor = vec4(col, alpha);
       }`,
    count: 6,
  })
}

onMounted(() => {
  if (!(heroMaskVideo.value && heroMaskCanvas.value)) return

  const vid = heroMaskVideo.value
  const cvs = heroMaskCanvas.value

  const { width: cssW, height: cssH } = cvs.getBoundingClientRect()

  const dpr = window.devicePixelRatio || 1
  cvs.width = Math.round(cssW * dpr)
  cvs.height = Math.round(cssH * dpr)

  regl = reglConstructor({
    canvas: heroMaskCanvas.value!,
    pixelRatio: window.devicePixelRatio,
  })

  vid.addEventListener('play', () => {
    isAnimated.value = true
    initRenderFunction()
    regl?.frame(() => drawBlend!())
  })
})

function triggerAnimation() {
  if (!heroMaskVideo.value || isAnimated.value) {
    return
  }

  heroMaskVideo.value.pause()
  heroMaskVideo.value.currentTime = 0
  heroMaskVideo.value.play()
}
</script>

<template>
  <div
    class="h-fit max-w-full overflow-hidden"
    :class="{ 'md:max-w-[405px]': !isHero }"
    @focusin="triggerAnimation"
    @touchstart="triggerAnimation"
    @click="triggerAnimation"
    @mouseenter="triggerAnimation">
    <div class="relative aspect-square w-full overflow-hidden rounded-md">
      <canvas ref="hero-mask-canvas" class="pointer-events-none absolute inset-0 z-20 aspect-[2/3] w-full" />
      <img
        ref="hero-image"
        :src="image"
        :alt="`${name}, ${designation}`"
        :width="512"
        :height="Math.round(512 / (2 / 3))"
        class="absolute inset-0 z-10 aspect-[2/3] w-full object-cover object-top grayscale filter" />
      <video ref="hero-mask-video" :src="heroVideoEffect" muted playsinline class="hidden" />
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
