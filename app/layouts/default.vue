<script setup lang="ts">
const { proxy: gaProxy } = useScriptGoogleAnalytics()

const isModelContactOpen = ref<boolean>(false)

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
const isDarkMode = computed(() => route.path.includes('/photo') || route.path.includes('/blog/'))
</script>

<template>
  <div>
    <AppHeader :color-mode="isLightMode ? 'light' : isDarkMode ? 'dark' : 'auto'" />
    <main class="relative mx-auto flex min-h-screen max-w-[90rem] flex-col gap-4 overflow-hidden px-2 md:mb-8 md:px-4" :class="hasFloatingActionBar ? 'mb-20' : 'mb-2'">
      <slot />
      <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
      <AppFooter @contact="onContact(true)" />
    </main>
  </div>
</template>
