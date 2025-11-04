<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    title: string
    active?: boolean
    collapsable?: boolean
  }>(),
  {
    active: false,
    collapsable: false,
  }
)
</script>

<template>
  <button
    class="flex items-center justify-center gap-2 py-1.5 pl-3 pr-4 transition-colors duration-300 ease-out md:py-2 md:pl-5 md:pr-6"
    :class="[
      active
        ? 'bg-gradient-to-r from-primary-500 to-dark-400/60 fill-white text-white hover:from-primary-400 hover:to-dark-400/60 dark:to-transparent dark:hover:to-transparent'
        : 'bg-white fill-primary-500 text-primary-500 hover:bg-light-500 dark:bg-dark-400 dark:hover:bg-dark-400',
    ]">
    <NuxtIcon :name="`local:${icon}`" :class="[collapsable ? 'px-3 py-1 text-[32px] md:p-0' : 'text-[20px] md:text-[32px]']" />
    <span
      class="translate-y-0.5 text-sm font-semi-bold capitalize md:text-lg"
      :class="{
        'hidden md:inline': collapsable,
      }"
      >{{ title }}</span
    >
  </button>
</template>
