<script setup lang="ts">
const mobileMenuOpen = ref(false)

function toggleMobileMenu(value?: boolean) {
  mobileMenuOpen.value = value === undefined ? !mobileMenuOpen.value : value
}
</script>

<template>
  <header class="absolute left-0 right-0 top-6 mx-auto max-w-[90rem] px-4 text-white md:px-16">
    <nav class="relative z-20 grid grid-cols-3 items-center">
      <NuxtLink to="/" class="size-fit" aria-label="home">
        <NuxtIcon name="local:logo-full" filled class="text-[80px] md:text-[112px]" />
      </NuxtLink>
      <AppNavbar :is-open="mobileMenuOpen" @close="toggleMobileMenu(false)" />
      <div class="col-start-3 -translate-y-1/4 justify-self-end md:-translate-y-1/2">
        <button class="p-4 focus:outline-none md:hidden" @click="toggleMobileMenu(true)">
          <NuxtIcon name="local:hamburger" class="text-[32px]" />
        </button>
        <ButtonColorMode class="hidden md:block" />
      </div>
    </nav>
  </header>
</template>
