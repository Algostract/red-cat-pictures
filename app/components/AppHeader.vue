<script setup lang="ts">
defineProps<{
  isLightMode: boolean
}>()

const mobileMenuOpen = ref(false)

function toggleMobileMenu(value?: boolean) {
  mobileMenuOpen.value = value === undefined ? !mobileMenuOpen.value : value
}
</script>

<template>
  <header class="absolute left-0 right-0 top-4 mx-auto max-w-[90rem] px-4 md:px-16" :class="[isLightMode ? 'fill-white text-white' : 'fill-black text-black dark:fill-white dark:text-white']">
    <nav class="relative z-20 grid grid-cols-3 items-center">
      <NuxtLink to="/" class="size-fit" aria-label="home">
        <NuxtIcon name="local:logo" filled class="text-[64px] md:text-[96px]" :class="isLightMode ? 'inline' : 'hidden dark:inline'" />
        <NuxtIcon name="local:logo-dark" filled class="text-[64px] md:text-[96px]" :class="isLightMode ? 'hidden' : 'inline dark:hidden'" />
      </NuxtLink>
      <AppNavbar :is-open="mobileMenuOpen" @close="toggleMobileMenu(false)" />
      <div class="col-start-3 justify-self-end">
        <button class="p-4 focus:outline-none md:hidden" @click="toggleMobileMenu(true)">
          <NuxtIcon name="local:hamburger" class="text-[32px]" />
        </button>
        <ButtonColorMode class="hidden md:block" />
      </div>
    </nav>
  </header>
</template>
