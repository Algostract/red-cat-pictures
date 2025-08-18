<script setup lang="ts">
import iconLogo from '~/assets/icons/gfb.svg'

const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onVisit() {
  gaProxy.gtag('event', 'visit-bowl')
}
</script>

<template>
  <div class="fixed bottom-44 left-0 z-50" role="alert">
    <NuxtLink
      to="https://bowl.redcatpictures.com"
      external
      target="_blank"
      rel="noopener"
      class="relative flex flex-col items-center justify-center gap-2 rounded-r-2xl bg-[#FFD400] p-2 pb-3"
      aria-label="Visit Gold Fish Bowl"
      @click="onVisit">
      <img :src="iconLogo" alt="gold-fish-bowl-logo" :width="32" :height="32" />
      <div class="relative h-32 w-3">
        <span class="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap text-sm font-semi-bold tracking-wide text-black"> Visit Gold Fish Bowl </span>
      </div>
    </NuxtLink>
  </div>
</template>
