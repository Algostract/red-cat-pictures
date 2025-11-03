<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
}>()

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const isModelContactOpen = useState<boolean>('isModelContactOpen', () => false)

function onContact(action: boolean) {
  if (action) {
    isModelContactOpen.value = true
    gaProxy.gtag('event', 'contact_open')
  } else {
    isModelContactOpen.value = false
    gaProxy.gtag('event', 'contact_close')
  }
}

const isMobile = useMediaQuery('(max-width: 767px)')

const COLS = computed<number>(() => (isMobile.value ? 3 : 7))

const allPhotos = computed(() => {
  return props.photos.filter(({ gallery }) => gallery)
})

const columns = computed<Photo[][]>(() => {
  const cols: Photo[][] = Array.from({ length: COLS.value }, () => [])
  allPhotos.value.forEach((photo, idx) => {
    cols[idx % COLS.value].push(photo)
  })
  return cols
})
</script>

<template>
  <section class="bg-neutral-900 relative mb-8 flex h-screen w-full items-center justify-center overflow-hidden">
    <div class="pointer-events-none absolute inset-0 flex -rotate-12 scale-[1.4] items-center justify-center" style="perspective(900px)">
      <div class="size-screen grid gap-1 overflow-hidden" :class="`grid-cols-${COLS}`">
        <div
          v-for="(col, colIdx) in columns"
          :key="colIdx"
          :style="{ gridColumn: colIdx + 1, animationDuration: allPhotos.length * 1.5 + 's' }"
          :class="colIdx % 2 === 0 ? 'animate-marquee-y' : 'animate-marquee-y-reverse'"
          class="w-fit">
          <div v-for="(card, i) in col" :key="i" class="aspect-[3/4] h-auto w-full overflow-hidden">
            <NuxtImg :src="extractCdnId(card.image!)" alt="Card" :width="256" :height="341" loading="eager" preload class="object-cover" :draggable="false" />
          </div>
        </div>
      </div>
    </div>
    <!-- Hero text/CTA -->
    <div class="absolute inset-0 z-20 bg-black/80">
      <div class="relative z-30 flex h-full w-full flex-col items-center justify-center px-4 md:px-0">
        <div class="flex flex-col items-center text-center">
          <h1 class="md:text-6xl font-extrabold mb-5 text-3xl text-white drop-shadow-lg">Close every deal.</h1>
          <p class="mx-auto mb-6 max-w-xl text-base md:text-2xl">A snapshot of your entire sales pipeline, beautifully showcased.</p>
          <button class="text-neutral-900 mt-2 bg-gradient-to-r from-primary-500 to-transparent px-7 py-3 text-base font-bold shadow-2xl transition hover:scale-105 md:text-lg" @click="onContact">
            See how it works
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:root {
  @apply grid-cols-3 grid-cols-7;
}

.animate-marquee-y {
  animation: marquee-y linear infinite;
}

.animate-marquee-y-reverse {
  animation: marquee-y linear infinite reverse;
}

@keyframes marquee-y {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-50%);
  }
}
</style>
