<script setup lang="ts">
defineProps<{
  video: Video
}>()

const emit = defineEmits<{
  contact: []
}>()
</script>

<template>
  <section
    id="hero"
    class="grid h-[calc(100vh-1rem)] grid-cols-3 grid-rows-[repeat(3,min-content)] items-center gap-y-[4.5rem] overflow-hidden pt-24 text-white md:pt-32 lg:h-[calc(100vh-4rem)] lg:grid-rows-1 lg:pt-0">
    <NuxtVideo
      v-if="video"
      class="absolute left-1/2 top-0 col-span-full col-start-1 row-span-full row-start-1 h-screen w-screen -translate-x-1/2 object-cover"
      :source="video.sources"
      :poster="video.poster"
      :disable-picture-in-picture="true"
      controls-list="nodownload"
      :autoplay="true"
      :muted="true"
      :playsinline="true"
      :loop="true"
      preload="metadata" />
    <div class="relative col-span-3 !col-start-1 row-start-1 flex flex-col gap-6 text-center md:row-start-2 lg:col-span-2 lg:text-left">
      <h1 class="-mb-1 text-3xl font-semi-bold md:text-5xl">Elevate Your <br /><span class="rounded bg-primary-500 px-2 py-2">Brand</span> Image</h1>
      <p class="mx-auto max-w-screen-sm text-lg leading-9 tracking-wide md:text-xl lg:mx-0">Nurture the essence of your product with our photography & videography services</p>
      <ButtonCTA class="hidden self-start lg:flex" @click="emit('contact')" />
    </div>
    <div class="relative bottom-[5rem] col-span-full col-start-1 row-start-4 flex flex-col items-center gap-4 self-end md:bottom-16">
      <ButtonCTA class="items-center justify-self-center lg:hidden" @click="emit('contact')" />
      <BrandSlider />
    </div>
  </section>
</template>

<style scoped>
.gradient-mask {
  @apply md:[mask-image:linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_20%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_80%,rgba(0,0,0,0)_100%)];
}
</style>
