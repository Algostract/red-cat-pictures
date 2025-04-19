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
const hasCoverImage = computed(() => route.path === '/' || route.path.includes('/episode/'))
</script>

<template>
  <div>
    <AppHeader :is-light-mode="hasCoverImage" />
    <main class="relative mx-auto flex min-h-screen max-w-[90rem] flex-col gap-4 overflow-hidden px-4 md:mb-8" :class="hasFloatingActionBar ? 'mb-20' : 'mb-2'">
      <slot />
      <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
      <AppFooter @contact="onContact(true)" />
    </main>
  </div>
</template>
