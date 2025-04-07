<script setup lang="ts">
withDefaults(defineProps<{ primary?: boolean }>(), {
  primary: true,
})
</script>

<template>
  <button
    class="z-10 flex h-fit w-fit items-center justify-between gap-3 rounded p-[6px] pl-5 text-base font-semi-bold transition-colors duration-500 ease-out md:gap-5 md:p-2 md:pl-6 md:text-lg"
    :class="primary ? 'bg-primary-500 text-white hover:bg-primary-400 hover:text-white' : 'bg-white text-primary-500 hover:bg-light-400 hover:text-primary-400'">
    <span class="whitespace-nowrap">Book a Session</span>
    <span class="rotate-180 rounded-full p-2 md:p-3" :class="primary ? 'bg-white' : 'bg-primary-500'">
      <NuxtIcon name="local:chevron-bold" class="text-[20px] md:text-[24px]" :class="primary ? 'fill-primary-500' : 'fill-white'" />
    </span>
  </button>
</template>
