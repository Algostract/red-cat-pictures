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
  animation: 'burn' | 'fly-in'
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
let renderer: reglConstructor.DrawCommand<reglConstructor.DefaultContext> | undefined

function initRenderFunction() {
  if (renderer || !regl) return

  // textures shared by all animations
  const maskTex = regl.texture({ flipY: false })
  const imageTex = regl.texture({ flipY: false })

  switch (props.animation) {
    case 'burn':
      renderer = regl({
        attributes: { position: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1] },
        uniforms: {
          src: () => (imageTex({ data: heroImage.value }), imageTex),
          mask: () => (maskTex({ data: heroMaskVideo.value }), maskTex),
        },
        vert: `
        precision mediump float;
        attribute vec2 position;
        varying vec2 uv;
        void main() {
          uv = position * 0.5 + 0.5;
          uv.y = 1.0 - uv.y;
          gl_Position = vec4(position, 0, 1);
        }`,
        frag: `
        precision mediump float;
        uniform sampler2D src, mask;
        varying vec2 uv;
        void main() {
          vec4 s = texture2D(src, uv);
          vec4 m = texture2D(mask, uv);
          float a = (m.r + m.g + m.b) / 3.0;
          gl_FragColor = vec4(mix(m.rgb, s.rgb, a), a);
        }`,
        count: 6,
      })
      break
    case 'fly-in': {
      const GRID_ROWS = 4
      const GRID_COLS = 6

      const positions: number[] = []
      const uvs: number[] = []
      const pieceIndices: number[] = []

      for (let r = 0; r < GRID_ROWS; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const x0 = -1 + (2 * c) / GRID_COLS
          const y0 = -1 + (2 * r) / GRID_ROWS
          const x1 = -1 + (2 * (c + 1)) / GRID_COLS
          const y1 = -1 + (2 * (r + 1)) / GRID_ROWS

          const u0 = c / GRID_COLS
          const v0 = r / GRID_ROWS
          const u1 = (c + 1) / GRID_COLS
          const v1 = (r + 1) / GRID_ROWS

          positions.push(x0, y0, x1, y0, x1, y1, x0, y0, x1, y1, x0, y1)
          uvs.push(u0, v0, u1, v0, u1, v1, u0, v0, u1, v1, u0, v1)
          const idx = r * GRID_COLS + c
          for (let i = 0; i < 6; i++) pieceIndices.push(idx)
        }
      }

      renderer = regl({
        attributes: {
          position: positions,
          uv: uvs,
          pieceIndex: {
            buffer: regl.buffer(pieceIndices),
            divisor: 0,
          },
        },
        uniforms: {
          tex: () => (imageTex({ data: heroImage.value }), imageTex),
          time: ({ tick }) => tick * 0.016 * 0.4,
          rows: GRID_ROWS,
          cols: GRID_COLS,
        },
        vert: `
        precision mediump float;
        attribute vec2 position, uv;
        attribute float pieceIndex;
        uniform float time, cols, rows;
        varying vec2 vUV;
        // simple hash if you still need randomness elsewhere
        float hash(float x) {
          return fract(sin(x * 12.9898) * 43758.5453);
        }
        void main() {
          float c = mod(pieceIndex, cols);
          float r = floor(pieceIndex / cols);

          // compute each tile's center in clip‐space
          vec2 center = vec2(
            -1.0 + (2.0 * (c + 0.5)) / cols,
            -1.0 + (2.0 * (r + 0.5)) / rows
          );


          // radial distance [0..1] from screen center to tile center
          float maxR = length(vec2(1.0, 1.0));
          float radial = length(center) / maxR;
          // delay so center pieces start first, outer ones up to 1.2s later
          // new: start up to 0.8s later
          float delay    = radial * 1.2;
          // same duration mapping
          float duration = mix(1.2, 0.6, radial);
          // linear progress in [0,1]
          float raw      = clamp((time - delay) / duration, 0.0, 1.0);
          // ease-out cubic
          float t        = 1.0 - pow(1.0 - raw, 3.0);


          // direction from off‐canvas toward the center point
          vec2 dirToCenter = normalize(center);
          float offDist    = mix(3.0, 0.0, t);
          float scale      = mix(2.5, 1.0, t);

          vec2 zoomed    = center + (position - center) * scale;
          vec2 displaced = zoomed + dirToCenter * offDist;

          vUV = uv;
          vUV.y = 1.0 - vUV.y;
          gl_Position = vec4(displaced, 0.0, 1.0);
        }`,
        frag: `
        precision mediump float;
        uniform sampler2D tex;
        varying vec2 vUV;
        void main() {
          gl_FragColor = texture2D(tex, vUV);
        }`,
        count: positions.length / 2,
        blend: {
          enable: true,
          func: { src: 'src alpha', dst: 'one minus src alpha' },
        },
      })

      break
    }
    default:
      break
  }
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
    regl?.frame(() => renderer!())
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
    <div class="relative isolate aspect-square w-full overflow-hidden rounded-md">
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
