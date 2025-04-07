<script setup lang="ts">
defineProps<{
  icon: string
  title: string
}>()
</script>

<template>
  <div class="relative mx-auto mb-3 flex w-fit items-center justify-center gap-2">
    <NuxtIcon :name="`local:${icon}`" class="fill-primary-500 text-[30px] md:text-[40px]" />
    <span class="flex h-6 w-44 items-center justify-center bg-primary-500 text-center text-base text-white md:h-8 md:w-64 md:text-xl">
      {{ title }}
    </span>
  </div>
</template>
