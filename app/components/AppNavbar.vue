<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onNavigate(section: string) {
  emit('close')
  gaProxy.gtag('event', 'navigate', { section })
}

const urls = ref([
  { url: '/#gallery', id: 'gallery', title: 'Gallery' },
  { url: '/photo', id: 'photos', title: 'Photos' },
  { url: '/#featured-videos', id: 'featured-videos', title: 'Videos' },
  { url: '/#pricing', id: 'pricing', title: 'Pricing' },
  { url: '/episode', id: 'episodes', title: 'Episodes' },
  { url: '/blog', id: 'blogs', title: 'Blogs' },
])

const isAnimate = ref(false)
</script>

<template>
  <div v-show="isOpen || isAnimate" class="fixed left-0 top-0 z-50 h-screen w-screen bg-black/70 md:hidden" @click.self="emit('close')">
    <Transition @before-enter="isAnimate = true" @after-leave="isAnimate = false">
      <div v-show="isOpen" class="bg-red-600 fixed right-0 z-50 h-screen w-64 bg-primary-500 text-white">
        <div class="flex h-full w-full flex-col items-end justify-between">
          <NuxtLink
            to="/"
            class="bg-white p-6 pb-14 pl-14 [mask-image:url('assets/images/logo-container.svg')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:102%]"
            @click="onNavigate(id)">
            <NuxtIcon name="local:logo-dark" filled class="text-[112px]" />
          </NuxtLink>
          <ul class="font-semibold flex flex-col gap-4 p-6 text-right text-xl">
            <li v-for="{ id, url, title } of urls" :key="id" class="py-2">
              <NuxtLink :to="url" class="block hover:underline" @click="onNavigate(id)">
                {{ title }}
              </NuxtLink>
            </li>
          </ul>
          <LazyButtonColorMode hydrate-on-visible class="m-6" />
        </div>
      </div>
    </Transition>
  </div>
  <ul class="hidden justify-center gap-8 whitespace-nowrap md:flex">
    <li v-for="{ id, url, title } of urls" :key="id">
      <NuxtLink :to="url" class="p-2" active-class="" @click="onNavigate(id)">{{ title }}</NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
:root {
  @apply visible;
}

.v-enter-active,
.v-leave-active {
  @apply transition-transform duration-300 ease-in-out;
}

.v-enter-from,
.v-leave-to {
  @apply translate-x-full;
}
</style>
