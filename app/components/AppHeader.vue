<script setup lang="ts">
const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onNavigate(section: string) {
  gaProxy.gtag('event', 'navigate', { section })
}
</script>

<template>
  <header class="absolute left-0 right-0 top-6 mx-auto max-w-[90rem] px-4 text-white md:px-16">
    <nav class="relative z-20 grid grid-cols-3 items-center">
      <NuxtLink to="/">
        <NuxtIcon name="logo-full" filled class="text-[80px] md:text-[112px]" />
      </NuxtLink>
      <ul class="hidden translate-y-1 justify-center gap-8 self-start whitespace-nowrap md:flex">
        <li>
          <NuxtLink to="#hero" @click="onNavigate('hero')">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#gallery" @click="onNavigate('gallery')">Gallery</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#featured-images" @click="onNavigate('featured-images')">Images</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#featured-videos" @click="onNavigate('featured-videos')">Videos</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#pricing" @click="onNavigate('pricing')">Pricing</NuxtLink>
        </li>
      </ul>
      <div class="col-start-3 -translate-y-1/2 justify-self-end">
        <ButtonColorMode />
      </div>
    </nav>
  </header>
</template>
