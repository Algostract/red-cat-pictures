<script setup lang="ts">
const { proxy: gaProxy } = useScriptGoogleAnalytics()

const isModelContactOpen = useState<boolean>('isModelContactOpen', () => false)

function onContact(action: boolean) {
  if (action) {
    isModelContactOpen.value = true
    gaProxy.gtag('event', 'contact_open')
  } else {
    isModelContactOpen.value = false
    gaProxy.gtag('event', 'contact_close')
  }
}

const route = useRoute()

const hasFloatingActionBar = computed(() => route.path === '/')
const isLightMode = computed(() => route.path === '/' || route.path.includes('/episode/'))
const isDarkMode = computed(() => route.path.includes('/blog/'))
</script>

<template>
  <div>
    <LazyAppHeader hydrate-on-idle :color-mode="isLightMode ? 'light' : isDarkMode ? 'dark' : 'auto'" />
    <main class="relative isolate mx-auto flex min-h-screen max-w-[90rem] flex-col gap-4 overflow-hidden px-2 md:mb-8 md:px-4" :class="hasFloatingActionBar ? 'mb-20' : 'mb-2'">
      <slot />
      <LazyAppFooter hydrate-on-visible @contact="onContact(true)" />
      <LazyModalContact v-show="isModelContactOpen" hydrate-on-visible :is-open="isModelContactOpen" @close="onContact(false)" />
    </main>
  </div>
</template>
