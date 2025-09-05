<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits<{
  close: []
}>()

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const methods = ref([
  { method: 'call', icon: 'phone', link: 'tel:+91891-048-9578' },
  // { method: 'email', icon: 'email', link: 'mailto:contact@redcatpictures.com' },
  { method: 'whatsapp', icon: 'whatsapp', link: 'https://wa.me/918910489578' },
])

function contact(method: string) {
  gaProxy.gtag('event', 'contact', { method })
}

function close() {
  emit('close')
}

function flippedClass(method: string) {
  return { flipped: method === 'whatsapp' }
}
</script>

<template>
  <ModalBase :is-open="isOpen" inner-class="grid grid-rows-2 grid-cols-2 gap-2 w-full !max-w-[24.5rem] aspect-[13/8] overflow-hidden" @close="close">
    <span class="col-span-2 col-start-1 row-start-1 mx-auto mb-2 mt-3 text-lg">Book a Session</span>
    <NuxtLink
      v-for="{ method, icon, link } of methods"
      :key="method"
      :to="link"
      target="_blank"
      :aria-label="method"
      class="col-start-1 row-span-2 row-start-1 flex aspect-square h-full w-full cursor-pointer flex-col items-center justify-center fill-white px-4 py-6 text-white transition-colors duration-500 ease-in-out"
      :class="flippedClass(method)"
      @click="contact(method)">
      <NuxtIcon :name="`local:${icon}`" class="text-[56px]" :class="flippedClass(method)" />
      <span class="font-semi-bold capitalize" :class="flippedClass(method)">{{ method }}</span>
    </NuxtLink>
    <svg width="0" height="0" style="position: absolute" viewBox="0 0 197 248" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="bgClip">
          <path d="M69.6346 0L194.612 124.978C197.736 128.102 197.736 133.167 194.612 136.291L82.9036 248H0V5.63452L5.63452 0H69.6346Z" fill="#D9D9D9" />
        </clipPath>
      </defs>
    </svg>
  </ModalBase>
</template>

<style scoped>
a {
  @apply bg-primary-500 drop-shadow-[inset_-2px_2px_8px_0_rgba(0,0,0,0.25)] transition-all duration-500 ease-out hover:bg-primary-400 hover:drop-shadow-[inset_-4px_4px_8px_0_rgba(0,0,0,0.25)];
  clip-path: url(#bgClip);
}

.flipped {
  @apply col-start-2 -scale-x-[1] [filter:FlipH];
  /* filter: FlipH; */
}
</style>
