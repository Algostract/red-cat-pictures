<script setup lang="ts">
const props = defineProps<{
  total: number
  activeIndex: number
  activePercent: number // e.g. 0.0 -> 1.0 for the current bar's fill
}>()

function getBarWidth(index: number): number {
  if (index < props.activeIndex) return 100
  if (index > props.activeIndex) return 0
  // index == activeIndex => partial fill
  return props.activePercent * 100
}
</script>

<template>
  <div class="flex h-0.5 items-center gap-2">
    <div v-for="(bar, i) in total" :key="i" class="relative h-full w-full flex-1 overflow-hidden rounded bg-white text-black">
      <!-- Filled portion -->
      <div
        class="absolute left-0 top-0 h-full bg-primary-500"
        :class="{ 'transition-all duration-200 ease-linear': getBarWidth(i) > 1 && getBarWidth(i) < 99 }"
        :style="{ width: getBarWidth(i) + '%' }" />
    </div>
  </div>
</template>
