<script setup lang="ts">
import iconLogo from '~/assets/icons/logo.svg'

const { $pwa } = useNuxtApp()
const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onInstall() {
  gaProxy.gtag('event', 'install')
  $pwa?.install()
}
</script>

<template>
  <div v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh" class="fixed bottom-28 right-0 z-50 drop-shadow-sm" role="alert">
    <button class="rounded-l-lg bg-light-600 px-2 py-1 transition-colors hover:bg-light-500" @click="onInstall">
      <img :src="iconLogo" alt="logo" :width="48" :height="48" class="" />
    </button>
  </div>
</template>
