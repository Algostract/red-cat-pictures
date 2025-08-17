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
    <button
      class="relative flex flex-col items-center justify-center gap-2 rounded-l-2xl bg-white p-2 pb-3 hover:bg-light-400 dark:bg-dark-500 dark:hover:bg-dark-400"
      aria-label="Install PWA"
      @click="onInstall">
      <img :src="isDark ? iconLogo : iconLogoDark" alt="red-cat-pictures-logo" :width="32" :height="32" />
      <div class="relative h-20 w-3">
        <span class="absolute left-1/2 top-1/2 inline-block -translate-x-1/2 -translate-y-1/2 rotate-90 whitespace-nowrap text-sm font-semi-bold tracking-wide text-black dark:text-white">
          Install App
        </span>
      </div>
    </button>
  </div>
</template>
