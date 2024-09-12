<script setup lang="ts">
const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onNavigate(section: string) {
  gaProxy.gtag('event', 'navigate', { section })
}
</script>

<template>
  <header class="absolute left-0 right-0 top-0 mx-auto max-w-[90rem] px-4 md:px-16">
    <nav class="relative z-20 grid grid-cols-3 items-center">
      <NuxtLink to="/">
        <NuxtIcon name="logo-full" class="text-[96px] md:text-[128px]" />
      </NuxtLink>
      <ul class="hidden justify-center gap-8 md:flex">
        <li>
          <NuxtLink to="#featured" @click="onNavigate('featured')">Featured</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#gallery" @click="onNavigate('gallery')">Gallery</NuxtLink>
        </li>
        <li>
          <NuxtLink to="#pricing" @click="onNavigate('pricing')">Pricing</NuxtLink>
        </li>
        <!-- <li><NuxtLink to="#testimonials" @click="onNavigate('testimonials')">Testimonials</NuxtLink></li> -->
      </ul>
      <div class="col-start-3 -translate-y-1/2 justify-self-end">
        <ButtonColorMode />
      </div>
    </nav>
  </header>
</template>
