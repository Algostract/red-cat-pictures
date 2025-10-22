<script setup lang="ts">
import iconLogo from '~/assets/icons/gft.svg'

const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onVisit() {
  gaProxy.gtag('event', 'visit-talents')
}
</script>

<template>
  <div class="fixed bottom-72 right-0 z-50 -translate-y-1/2" role="alert">
    <NuxtLink
      to="https://goldfishtalents.com?ref=redcatpictures.com"
      external
      target="_blank"
      rel="noopener"
      class="flex flex-col items-center gap-3 rounded-l-2xl bg-warning-400 px-2 pb-4 pt-3"
      aria-label="Find Talent at Gold Fish Talents"
      @click="onVisit">
      <img :src="iconLogo" alt="Gold Fish Talents Logo" :width="32" :height="32" />
      <div class="[writing-mode:vertical-rl]">
        <span class="font-semibold rotate-180 whitespace-nowrap text-sm tracking-wide text-black"> Find Talents </span>
      </div>
    </NuxtLink>
  </div>
</template>
