<script setup lang="ts">
const props = defineProps<{
  url: string
  title: string
  position: { x: number; y: number }
}>()

const description = ref<string>('')
const image = ref<string>('https://ucarecdn.com/27adefaa-f613-4d53-b60d-a58431a757b3/-/format/auto/-/scale_crop/2560x1440/center/')

watch(() => props, () => {
  console.log({ url: props.url, title: props.title, position: props.position })
})
</script>

<template>
  <NuxtLink :href="url" :style="{ position: 'absolute', top: position.x + 'px', left: position.y + 'px' }"
    class="flex aspect-square max-w-[318px] flex-col overflow-hidden border border-black bg-light-500 dark:bg-dark-500">
    <NuxtImg :src="image ?? ''" :alt="title" :width="640" :height="Math.round(640 / (16 / 9))" fit="cover" format="auto"
      loading="lazy" quality="smart"
      class="aspect-[13/7] w-full overflow-hidden rounded-sm bg-light-600 object-cover dark:bg-dark-500" />
    <div class="p-2 md:px-4">
      <h5 class="mb-2 mt-2 line-clamp-2 !no-underline text-lg font-regular md:mb-4 md:mt-[0.625rem]">{{ title }}</h5>
      <p class="line-clamp-3 opacity-60">{{ description }}</p>
    </div>
  </NuxtLink>
</template>
