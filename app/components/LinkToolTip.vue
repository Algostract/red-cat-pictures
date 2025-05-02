<script setup lang="ts">
const props = defineProps<{
  url: string
  title: string
  position: { x: number; y: number }
}>()

const url = computed(() => props.url)
const { data } = await useFetch('/api/external/meta', { query: { url } })

const title = computed(() => props.title ?? data.value?.ogTitle)
const description = computed(() => data.value?.ogDescription)
const image = computed<string>(() => data.value?.ogImage?.toString() ?? 'https://ucarecdn.com/771d0695-2196-4c98-b9eb-4f29acd6506f/-/format/auto/-/scale_crop/2560x1440/center/')
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 translate-y-2 scale-95">
    <NuxtLink
      :to="url"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      external
      target="_blank"
      rel="noopener"
      class="absolute z-50 flex w-[256px] -translate-x-1/2 flex-col overflow-hidden !whitespace-normal border border-black bg-light-500 !no-underline dark:bg-dark-500 md:w-[320px]"
      tabindex="-1">
      <NuxtImg
        :src="image"
        :alt="title"
        :width="640"
        :height="Math.round(640 / (16 / 9))"
        fit="cover"
        loading="lazy"
        :placeholder="[160, Math.round(160 / (16 / 9)), 'lightest', 25]"
        class="aspect-[13/7] w-full overflow-hidden rounded-sm bg-light-600 dark:bg-dark-500"
        :class="!data?.ogImage ? 'object-cover' : 'object-contain'" />
      <div class="p-2 md:px-4">
        <h5 class="mb-2 mt-2 line-clamp-2 text-lg md:mb-4 md:mt-[0.625rem]">{{ title }}</h5>
        <p class="text-md line-clamp-3 opacity-60">{{ description }}</p>
      </div>
    </NuxtLink>
  </Transition>
</template>
