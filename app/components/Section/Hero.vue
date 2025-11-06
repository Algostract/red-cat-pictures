<script setup lang="ts">
defineProps<{
  video: Video
}>()

const emit = defineEmits<{
  contact: []
}>()
</script>

<template>
  <section id="hero" class="text-shadow-lg grid h-dvh grid-cols-3 grid-rows-[repeat(3,min-content)] items-center gap-y-[4.5rem] pt-24 text-white md:px-16 md:pt-32 lg:grid-rows-1 lg:pt-0">
    <div class="absolute left-1/2 top-0 col-span-full col-start-1 row-span-full row-start-1 h-screen w-screen -translate-x-1/2 bg-black">
      <NuxtVideo
        v-if="video"
        class="gradient-mask size-full object-cover"
        :source="video.sources"
        :poster="video.poster"
        :disable-picture-in-picture="true"
        controls-list="nodownload"
        :autoplay="true"
        :muted="true"
        :playsinline="true"
        :loop="true"
        preload="auto" />
    </div>
    <div class="relative col-span-3 !col-start-1 row-start-1 flex flex-col gap-6 text-center md:row-start-2 lg:col-span-2 lg:text-left">
      <h1 class="text-3xl font-semi-bold md:text-5xl">
        BOLD MESSY <br /><span
          class="relative isolate bg-gradient-to-r from-primary-500 to-dark-400/60 px-2 py-2 after:absolute after:-bottom-2 after:left-2 after:-z-10 after:size-full after:bg-dark-400/60 after:content-['']"
          >MASCULINE</span
        >
      </h1>
      <p class="mx-auto max-w-screen-sm text-lg leading-9 tracking-wide md:text-xl lg:mx-0">Create your brand identity that speaks to your clients, with our product photography/videography service</p>
      <ButtonCTA class="hidden self-start lg:flex" :transparent="true" @click="emit('contact')" />
    </div>
    <div class="relative bottom-[5rem] col-span-full col-start-1 row-start-4 flex flex-col items-center gap-4 self-end md:bottom-16">
      <ButtonCTA class="items-center justify-self-center lg:hidden" :transparent="true" @click="emit('contact')" />
      <BrandSlider />
    </div>
  </section>
</template>

<style scoped>
.text-shadow-lg {
  text-shadow:
    0px 1px 1px rgb(0 0 0 / 0.35),
    0px 1px 2px rgb(0 0 0 / 0.35),
    0px 2px 4px rgb(0 0 0 / 0.35);
}

.gradient-mask {
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    /* Fully transparent at top */ rgba(0, 0, 0, 0.8) 8%,
    /* Light fade in, lower opacity */ rgba(0, 0, 0, 1) 15%,
    /* Moderate fade, not fully opaque */ rgba(0, 0, 0, 1) 85%,
    /* Reduced solid center zone */ rgba(0, 0, 0, 0.8) 92%,
    /* Light fade out, matching top */ rgba(0, 0, 0, 0.4) 100% /* Fully transparent at bottom */
  );
}
</style>
