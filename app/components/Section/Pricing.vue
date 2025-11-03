<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
}>()

const emit = defineEmits<{
  contact: []
}>()

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
  <div>
    <SectionLabel icon="photo" title="Signature Branding" />
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
      <div class="absolute inset-0 z-20 bg-black/90 text-white">
        <div class="relative z-30 flex h-full w-full flex-col items-center justify-center px-4 md:px-0">
          <div class="flex flex-col items-center gap-4 text-left md:gap-10">
            <h1 class="sweep-gradient font-extrabold bg-gradient-to-r from-primary-500 from-50% to-white text-center text-xl md:text-4xl">Signature Visuals for Brands That Dare to Lead</h1>
            <p class="mx-auto max-w-[52rem] text-sm !leading-8 md:text-lg">
              We specializes in <strong>food/product photography</strong>, and <strong>creative videography</strong> in Kolkata, India.<br />
              Your product deserves an experience — not a price tag. We partner with forward-thinking brands to create stunning imagery that tells stories, drives desire, and elevates perceived value.
              Our portfolio covers Kolkata’s top D2Cs, F&B ventures, and consumer brands looking for impactful food and product visuals in India’s creative capital.
            </p>
            <ul class="text-md max-w-[52rem] list-inside list-disc space-y-3 text-left">
              <li>Strategy-first <strong>food & product photography</strong> concepts tailored for your launch objectives in Kolkata, India</li>
              <li>
                Full-service production: casting, art direction, motion, and brand-centric
                <strong>videography</strong>
              </li>
              <li>Brand-safe rights and tailored assets for digital campaigns—delivered with a focus on quality brands</li>
            </ul>
            <ButtonCTA class="flex" :transparent="true" @click="emit('contact')" />
          </div>
        </div>
      </div>
    </section>
  </div>
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

.sweep-gradient {
  background: linear-gradient(90deg, var(--tw-gradient-stops));
  background-size: 200%;
  background-position: 0% 50%;
  animation: bg-sweep 2.5s linear alternate infinite;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

@keyframes bg-sweep {
  from {
    background-position: 60% 50%;
  }

  to {
    background-position: 100% 50%;
  }
}
</style>
