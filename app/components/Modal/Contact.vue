<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits<{
  close: []
}>()

const { proxy: gaProxy } = useScriptGoogleAnalytics()
// const { proxy: gtagProxy } = useScriptGoogleTagManager()

const methods = ref([
  { method: 'call', icon: 'phone', link: 'tel:+91891-048-9578' },
  // { method: 'email', icon: 'email', link: 'mailto:shirsendu2001@gmail.com' },
  { method: 'whatsapp', icon: 'whatsapp', link: 'https://wa.me/918910489578' },
])

function contact(method: string) {
  gaProxy.gtag('event', 'contact', { method })
  // gtagProxy.dataLayer.push({ event: 'conversion', value: 1 })
}

function close() {
  emit('close')
}

function flippedClass(method: string) {
  return { flipped: method === 'whatsapp' }
}
</script>

<template>
  <ModalBase :is-open="isOpen" inner-class="grid grid-rows-1 grid-cols-2 gap-4 pt-6 w-full !max-w-[24.5rem] overflow-hidden" @close="close">
    <span class="col-span-2 mx-auto mb-2 text-lg">Book a Session via</span>
    <NuxtLink
      v-for="{ method, icon, link } of methods"
      :key="method"
      :to="link"
      target="__blank"
      :aria-label="method"
      class="flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 px-9 pt-6 text-white transition-colors duration-500 ease-in-out dark:text-black"
      :class="flippedClass(method)"
      @click="contact(method)">
      <NuxtIcon :name="icon" class="text-[56px]" :class="flippedClass(method)" />
      <span class="font-semi-bold capitalize" :class="flippedClass(method)">{{ method }}</span>
    </NuxtLink>
  </ModalBase>
</template>

<style scoped>
a {
  @apply bg-primary-500 drop-shadow-[inset_-2px_2px_8px_0_rgba(0,0,0,0.25)] transition-all duration-500 ease-out hover:bg-primary-400 hover:drop-shadow-[inset_-4px_4px_8px_0_rgba(0,0,0,0.25)];
  clip-path: polygon(
    100% 100%,
    -0.212% 100%,
    -0.212% 0%,
    64.491% 9.708%,
    64.491% 9.708%,
    70.473% 10.99%,
    76.066% 12.952%,
    81.213% 15.533%,
    85.858% 18.678%,
    89.943% 22.327%,
    93.412% 26.422%,
    96.21% 30.906%,
    98.278% 35.72%,
    99.56% 40.806%,
    100% 46.106%,
    100% 100%
  );
}

.flipped {
  @apply -scale-x-[1] [filter:FlipH];
  /* filter: FlipH; */
}
</style>
