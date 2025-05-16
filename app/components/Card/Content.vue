<script setup lang="ts">
import type { Content } from '~~/shared/types'

interface ContentProp extends Content {
  isActive: boolean
}

defineProps<ContentProp>()

const emit = defineEmits<{
  active: []
}>()
</script>

<template>
  <NuxtLink :to="url" class="flex aspect-[32/28] max-w-[318px] flex-col overflow-hidden border border-primary-500 bg-light-500 dark:bg-dark-500" @click="emit('active')">
    <NuxtImg
      :src="cover ?? ''"
      :alt="title"
      :width="640"
      :height="Math.round(640 / (16 / 9))"
      fit="cover"
      loading="lazy"
      :placeholder="[160, Math.round(160 / (16 / 9)), 'lightest', 25]"
      class="cover-img aspect-[13/7] h-full w-full overflow-hidden rounded-sm bg-light-600 object-cover dark:bg-dark-500"
      :class="{ active: isActive }" />
    <div class="p-2 md:px-4">
      <!-- <FormattedDate date={time} class="uppercase text-sm opacity-60" /> -->
      <h2 class="my-1.5 line-clamp-2 text-lg font-semi-bold">{{ title }}</h2>
      <p class="line-clamp-2 opacity-60">{{ description }}</p>
    </div>
  </NuxtLink>
</template>

<style scoped>
.cover-img.active {
  view-transition-name: selected-episode;
}
</style>
