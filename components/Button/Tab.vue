<script setup lang="ts">
withDefaults(
  defineProps<{
    icon: string
    title: string
    active?: boolean
  }>(),
  {
    active: false,
  }
)
</script>

<template>
  <button
    class="flex items-center justify-center gap-2 rounded-full py-1.5 pl-3 pr-4 transition-colors duration-300 ease-out md:py-2 md:pl-5 md:pr-6"
    :class="{
      'bg-primary-500 hover:bg-primary-400 dark:text-dark-600 dark:hover:text-black': active,
      'bg-light-600 text-dark-400 hover:bg-light-500 hover:text-dark-500 dark:bg-dark-600 dark:text-primary-500 dark:hover:bg-dark-500 dark:hover:text-primary-400': !active,
    }">
    <NuxtIcon :name="icon" class="text-[20px] md:text-[32px]" />
    <span class="translate-y-0.5 text-sm font-semi-bold capitalize md:text-lg">{{ title }}</span>
  </button>
</template>
