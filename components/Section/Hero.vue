<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
}>()

const emit = defineEmits<{ (event: 'contact'): void }>()

const images = usePhoto(props.photos, ['Product-006-001', 'Product-001-002', 'Product-004-002'])
</script>

<template>
  <section id="hero" class="relative mt-24 grid h-screen grid-cols-3 grid-rows-[repeat(3,min-content)] items-center gap-y-[4.5rem] md:h-auto md:grid-rows-1 lg:mt-0">
    <div class="relative col-span-3 !col-start-1 row-start-1 flex flex-col gap-6 text-center md:col-span-2 md:text-left">
      <h1 class="text-3xl font-semi-bold md:text-5xl">
        Bring your<br />
        product to life
      </h1>
      <p class="max-w-screen-sm text-lg leading-9 tracking-wide md:text-xl">Nurture the essence of your product with our photography & videography services</p>
      <CTAButton class="hidden md:flex" @click="emit('contact')" />
    </div>
    <div
      class="gradient-mask relative -z-10 col-span-3 col-start-1 row-start-2 mx-auto flex items-center justify-center gap-4 sm:max-w-[32rem] md:col-span-2 md:col-start-2 md:row-start-1 md:flex-col lg:h-screen lg:max-w-full">
      <NuxtImg
        v-for="({ id, title }, index) in images"
        :key="id"
        provider="uploadcare"
        :src="id"
        :alt="title"
        :width="800"
        :height="450"
        class="aspect-video rounded-full md:translate-x-[10%] lg:scale-[80%]"
        :class="{ '-rotate-6': index !== 1 }" />
    </div>
    <CTAButton class="col-start-2 row-start-3 items-center justify-self-center md:hidden" @click="emit('contact')" />
  </section>
</template>

<style scoped>
.gradient-mask {
  @apply md:[mask-image:linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_20%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_80%,rgba(0,0,0,0)_100%)];
}
</style>
