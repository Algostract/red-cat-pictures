<script setup lang="ts">
defineProps<{
  active: boolean
  title: string
  price: number
  unit: string
  points: {
    icon: string
    content: string
  }[]
}>()

const emit = defineEmits<{
  contact: []
}>()
</script>

<template>
  <div
    class="my-4 flex aspect-[5/8] w-[254px] flex-col items-center justify-between rounded-[2.75rem] bg-light-500 px-5 py-8 dark:bg-dark-500 md:mx-auto md:w-[323px] md:rounded-[4.4rem] md:px-9 md:py-12 xl:w-[392px]"
    :class="{ 'scale-105 border border-primary-500': active }">
    <h2 class="w-min text-center text-lg text-primary-500 md:text-2xl">
      {{ title }}
    </h2>
    <span class="flex items-center justify-center gap-2">
      <h3 class="text-center text-3xl md:text-3xl">₹{{ price }}</h3>
      <h4>/ {{ unit }}</h4>
    </span>
    <ul class="flex w-full flex-col gap-3 md:gap-5">
      <li
        v-for="{ icon, content } in points"
        :key="icon"
        class="relative flex w-full items-center gap-3 overflow-hidden rounded-2xl bg-light-400 px-4 py-3 text-center before:absolute before:left-0 before:h-[26px] before:w-[3px] before:rounded-full before:bg-primary-500 before:content-[''] after:absolute after:right-0 after:h-[26px] after:w-[3px] after:rounded-full after:bg-primary-500 after:content-[''] dark:bg-dark-400">
        <NuxtIcon :name="icon" class="text-[24px] text-primary-500 md:text-[36px]" />
        <span class="text-left text-2xs md:text-base">{{ content }}</span>
      </li>
    </ul>
    <button
      class="rounded-xl bg-primary-500 px-7 py-2 text-xs font-semi-bold text-black transition-colors duration-300 ease-out hover:bg-primary-400 md:rounded-3xl md:px-10 md:py-4 md:text-lg"
      @click="emit('contact')">
      Contact
    </button>
  </div>
</template>
