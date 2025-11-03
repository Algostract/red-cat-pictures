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
  <div class="isolate flex min-h-screen w-screen flex-col items-center justify-start" :class="hasFloatingActionBar ? 'mb-20' : 'mb-2'">
    <LazyAppHeader hydrate-on-idle :color-mode="isLightMode ? 'light' : isDarkMode ? 'dark' : 'auto'" />
    <main class="relative mx-auto flex w-full grow flex-col gap-4 px-2 md:px-4">
      <slot />
      <LazyModalContact v-show="isModelContactOpen" hydrate-on-visible :is-open="isModelContactOpen" @close="onContact(false)" />
    </main>
    <LazyAppFooter hydrate-on-visible @contact="onContact(true)" />
  </div>
</template>
