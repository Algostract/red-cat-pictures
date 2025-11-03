<script setup lang="ts">
import type { ServicePrice } from '~~/shared/types'

interface PriceProp extends ServicePrice {
  isActive: boolean
}

defineProps<PriceProp>()

const emit = defineEmits<{
  contact: []
}>()
</script>

<template>
  <div
    class="my-4 flex aspect-[5/8] w-[254px] flex-col items-center justify-between bg-light-500 px-5 py-8 drop-shadow-md dark:bg-dark-500 md:mx-auto md:w-[323px] md:px-9 md:py-12 xl:w-[392px]"
    :class="[isActive ? 'border border-primary-500' : 'scale-95']">
    <h2
      class="w-min whitespace-nowrap text-center text-lg text-primary-500 md:text-2xl"
      v-html="
        title
          .split(' ')
          .map((w, i, a) => (i === Math.ceil(a.length / 2) ? `<br>${w}` : w))
          .join(' ')
      " />
    <span class="flex items-center justify-center gap-2">
      <h3 class="text-center text-3xl md:text-3xl">₹{{ price }}</h3>
      <h4>/ {{ unit }}</h4>
    </span>
    <ul class="flex w-full flex-col gap-3 md:gap-5">
      <li v-for="{ icon, title } in points" :key="icon" class="relative flex w-full items-center gap-3 overflow-hidden bg-light-400 px-4 py-3 text-center dark:bg-dark-400">
        <NuxtIcon :name="`local:${icon}`" class="shrink-0 fill-primary-500 text-[24px] md:text-[36px]" />
        <span class="text-left text-2xs md:text-base">{{ title }}</span>
      </li>
    </ul>
    <button class="bg-primary-500 px-7 py-2 text-xs font-semi-bold text-white transition-colors duration-300 ease-out hover:bg-primary-400 md:px-10 md:py-4 md:text-lg" @click="emit('contact')">
      Contact
    </button>
  </div>
</template>
