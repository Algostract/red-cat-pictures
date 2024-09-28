<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
}>()

const emit = defineEmits<{
  contact: []
}>()

const selectedImage = ref(['Product-008-001', 'Product-006-001', 'Product-001-002', 'Product-004-002', 'Product-003-001'])
const images = usePhoto(props.photos, selectedImage)

useIntervalFn(() => {
  const values = selectedImage.value

  const shiftedElement = values.shift()
  if (shiftedElement) values.push(shiftedElement)

  selectedImage.value = values
}, 4000)
</script>

<template>
  <section id="hero" class="relative mt-32 grid h-screen grid-cols-3 grid-rows-[repeat(3,min-content)] items-center gap-y-[4.5rem] md:mt-24 md:h-auto md:grid-rows-1 lg:mt-0">
    <div class="relative col-span-3 !col-start-1 row-start-1 flex flex-col gap-6 text-center md:col-span-2 md:text-left">
      <h1 class="-mb-1 text-3xl font-semi-bold md:text-5xl">Elevate Your <br />Brand Image</h1>
      <p class="max-w-screen-sm text-lg leading-9 tracking-wide md:mb-8 md:text-xl">Nurture the essence of your product with our photography & videography services</p>
      <ButtonCTA class="hidden md:flex" @click="emit('contact')" />
    </div>
    <div
      class="gradient-mask relative col-span-3 col-start-1 row-start-2 mx-auto flex w-full max-w-[32rem] items-center justify-center gap-28 overflow-hidden md:col-span-2 md:col-start-2 md:row-start-1 md:translate-x-[20%] md:flex-col lg:h-screen lg:max-w-full">
      <TransitionGroup name="slide" move-class="transition-transform duration-1000 ease-in-out">
        <div v-for="({ id, title }, index) in images" :key="id" class="relative w-full shrink-0">
          <NuxtImg
            provider="uploadcare"
            :src="id"
            :alt="title"
            :width="640"
            :height="360"
            fit="fill"
            class="rounded-full transition-transform delay-100 duration-1000 ease-in-out"
            :class="{ invisible: index === images.length - 1, '-rotate-6': index !== Math.floor(images.length / 2) }" />
        </div>
      </TransitionGroup>
    </div>
    <ButtonCTA class="col-start-2 row-start-3 items-center justify-self-center md:hidden" @click="emit('contact')" />
  </section>
</template>

<style scoped>
.gradient-mask {
  @apply md:[mask-image:linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_20%,rgba(0,0,0,1)_50%,rgba(0,0,0,1)_80%,rgba(0,0,0,0)_100%)];
}
</style>
