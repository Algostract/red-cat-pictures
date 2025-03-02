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
</script>

<template>
  <div>
    <AppHeader />
    <main class="relative mx-auto mb-20 flex min-h-screen max-w-[90rem] flex-col gap-4 overflow-hidden p-4 !pb-0 md:mb-8 lg:p-16">
      <slot />
      <ModalContact :is-open="isModelContactOpen" @close="onContact(false)" />
      <AppFooter @contact="onContact(true)" />
    </main>
  </div>
</template>
