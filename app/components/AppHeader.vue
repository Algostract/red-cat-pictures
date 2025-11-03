<script setup lang="ts">
withDefaults(
  defineProps<{
    colorMode?: 'light' | 'dark' | 'auto'
  }>(),
  {
    colorMode: 'auto',
  }
)

const mobileMenuOpen = ref(false)

function toggleMobileMenu(value?: boolean) {
  mobileMenuOpen.value = value === undefined ? !mobileMenuOpen.value : value
}
</script>

<template>
  <header
    class="absolute left-0 right-0 top-4 mx-auto px-4 md:px-16"
    :class="{ 'fill-white text-white': colorMode === 'light', 'fill-black text-black': colorMode === 'dark', 'fill-black text-black dark:fill-white dark:text-white': colorMode === 'auto' }">
    <nav class="relative z-20 grid grid-cols-3 items-center">
      <NuxtLink to="/" class="size-fit" aria-label="home">
        <NuxtIcon name="local:logo" filled class="text-[64px] md:text-[96px]" :class="{ hidden: colorMode === 'dark', 'hidden dark:inline': colorMode === 'auto' }" />
        <NuxtIcon name="local:logo-dark" filled class="text-[64px] md:text-[96px]" :class="{ hidden: colorMode === 'light', 'inline dark:hidden': colorMode === 'auto' }" />
      </NuxtLink>
      <AppNavbar :is-open="mobileMenuOpen" @close="toggleMobileMenu(false)" />
      <div class="col-start-3 justify-self-end">
        <button aria-label="menu" class="p-4 focus:outline-none md:hidden" @click="toggleMobileMenu(true)">
          <NuxtIcon name="local:hamburger" class="text-[32px]" />
        </button>
        <LazyButtonColorMode hydrate-on-visible class="hidden md:block" />
      </div>
    </nav>
  </header>
</template>
