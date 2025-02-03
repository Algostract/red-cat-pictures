<script setup lang="ts">
import iconLogo from '~/assets/icons/logo.svg'
import iconLogoDark from '~/assets/icons/logo-dark.svg'

const { $pwa } = useNuxtApp()
const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onInstall() {
  gaProxy.gtag('event', 'install')
  $pwa?.install()
}

const isDark = useDark()
</script>

<template>
  <div v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh" class="fixed bottom-28 right-0 z-50 drop-shadow-sm" role="alert">
    <button class="rounded-l-lg bg-white px-2 py-1 transition-colors hover:bg-light-400 dark:bg-dark-500 dark:hover:bg-dark-400" @click="onInstall">
      <img :src="isDark ? iconLogo : iconLogoDark" alt="logo" :width="48" :height="48" class="" />
    </button>
  </div>
</template>
