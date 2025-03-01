<script setup lang="ts">
defineProps<{
  title: string
  cover: string | null
  createdAt: string
  description: string
  url: string
}>()
</script>

<template>
  <NuxtLink :href="url" class="flex h-full max-w-[318px] flex-col overflow-hidden border border-primary-500 bg-light-500 dark:bg-dark-500">
    <NuxtImg
      provider="uploadcare"
      :src="cover ?? ''"
      :alt="title"
      :width="640"
      :height="Math.round(640 / (16 / 9))"
      fit="cover"
      format="auto"
      loading="lazy"
      quality="smart"
      class="aspect-[13/7] w-full overflow-hidden rounded-sm bg-light-600 object-cover dark:bg-dark-500" />
    <div class="p-2 md:px-4">
      <!-- <FormattedDate date={time} class="uppercase text-sm opacity-60" /> -->
      <h2 class="mb-2 mt-2 line-clamp-2 text-lg font-semi-bold md:mb-4 md:mt-[0.625rem]">{{ title }}</h2>
      <p class="line-clamp-3 opacity-60">{{ mdToText(description).split('.').slice(0, 2).join('.') }}</p>
    </div>
  </NuxtLink>
</template>
