<script setup lang="ts">
defineProps<{
  title: string
  cover: string | null
  createdAt: string
  description: string
  url: string
  isActive: boolean
}>()

const emit = defineEmits<{
  active: []
}>()
</script>

<template>
  <NuxtLink :href="url" class="flex aspect-[32/28] max-w-[318px] flex-col overflow-hidden border border-primary-500 bg-light-500 dark:bg-dark-500" @click="emit('active')">
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
      class="cover-img aspect-[13/7] h-full w-full overflow-hidden rounded-sm bg-light-600 object-cover dark:bg-dark-500"
      :class="{ active: isActive }" />
    <div class="p-2 md:px-4">
      <!-- <FormattedDate date={time} class="uppercase text-sm opacity-60" /> -->
      <h2 class="my-1.5 line-clamp-2 text-lg font-semi-bold">{{ title }}</h2>
      <p class="line-clamp-2 opacity-60">{{ mdToText(description).split('.').slice(0, 2).join('.') }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.cover-img.active {
  view-transition-name: selected-episode;
}
</style>
