<script setup lang="ts">
const emit = defineEmits<{
  click: [value: 'left' | 'right']
}>()
</script>

<template>
  <div class="inline-flex scale-90 items-center space-x-2 rounded-full bg-white px-1.5 py-1.5 shadow-md md:scale-100">
    <button class="flex size-11 items-center justify-center fill-primary-500 hover:fill-primary-400 focus:outline-none" aria-label="Previous" @click="emit('click', 'left')">
      <NuxtIcon name="local:chevron-bold" class="text-[24px]" />
    </button>
    <button
      class="flex size-11 scale-x-[-1] items-center justify-center rounded-full bg-primary-500 fill-white hover:bg-primary-400 focus:outline-none"
      aria-label="Next"
      @click="emit('click', 'right')">
      <NuxtIcon name="local:chevron-bold" class="pr-1 text-[24px]" />
    </button>
  </div>
</template>
