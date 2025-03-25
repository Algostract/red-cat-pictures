<script setup lang="ts">
const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onNavigate(section: string) {
  gaProxy.gtag('event', 'navigate', { section })
}

const urls = ref([
  /* {
    "url": "#hero",
    "id": "hero",
    "title": "Home"
  }, */
  {
    url: '/#gallery',
    id: 'gallery',
    title: 'Gallery',
  },
  {
    url: '/#featured-images',
    id: 'featured-images',
    title: 'Images',
  },
  {
    url: '/#featured-videos',
    id: 'featured-videos',
    title: 'Videos',
  },
  {
    url: '/#pricing',
    id: 'pricing',
    title: 'Pricing',
  },
  {
    url: '/episode',
    id: 'episods',
    title: 'Episodes',
  },
])
</script>

<template>
  <header class="absolute left-0 right-0 top-6 mx-auto max-w-[90rem] px-4 text-white md:px-16">
    <nav class="relative z-20 grid grid-cols-3 items-center">
      <NuxtLink to="/" class="size-fit" aria-label="home">
        <NuxtIcon name="logo-full" filled class="text-[80px] md:text-[112px]" />
      </NuxtLink>
      <ul class="hidden translate-y-1 justify-center gap-8 self-start whitespace-nowrap md:flex">
        <li v-for="{ id, url, title } of urls" :key="id">
          <NuxtLink :to="url" class="p-2" @click="onNavigate(id)">{{ title }}</NuxtLink>
        </li>
      </ul>
      <div class="col-start-3 -translate-y-1/2 justify-self-end">
        <ButtonColorMode />
      </div>
    </nav>
  </header>
</template>
