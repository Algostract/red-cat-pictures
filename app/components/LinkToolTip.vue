<script setup lang="ts">
const props = defineProps<{
  activeLink?: {
    url: string
    title: string
    position: { x: number; y: number }
  }
}>()

const url = computed(() => props.activeLink?.url)
const data = ref<MetaData>()
const isDark = useDark()

watch(url, async (value) => {
  if (!value) return

  data.value = await $fetch<MetaData>('/api/external/meta', { query: { url: value } })
})

const title = computed(() => data.value?.ogTitle ?? props.activeLink?.title)
const description = computed(() => data.value?.ogDescription)
const image = computed<string>(() => data.value?.ogImage?.toString() ?? 'https://ucarecdn.com/771d0695-2196-4c98-b9eb-4f29acd6506f/-/format/auto/-/scale_crop/2560x1440/center/')
const logo = computed<string>(() => data.value?.logo?.toString() ?? (isDark.value ? '/logo-light.png' : '/logo-dark.png'))
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
      v-if="activeLink"
      :key="`${activeLink.position.x}_${activeLink.position.y}`"
      :to="url"
      :style="{ left: activeLink.position.x + 'px', top: activeLink.position.y + 'px' }"
      external
      target="_blank"
      rel="noopener"
      class="absolute z-50 flex w-[256px] -translate-x-1/2 flex-col overflow-hidden !whitespace-normal border border-black bg-light-500 !no-underline dark:bg-dark-500 md:w-[320px]"
      tabindex="-1">
      <NuxtImg
        provider="ipx"
        :src="image"
        :alt="activeLink.title"
        :width="640"
        :height="Math.round(640 / (16 / 9))"
        fit="cover"
        class="aspect-[13/7] w-full overflow-hidden bg-light-600 object-cover object-top dark:bg-dark-500" />
      <div class="relative flex flex-col gap-2 p-6 pb-4">
        <NuxtImg
          provider="ipx"
          :src="logo"
          :alt="activeLink.title"
          :width="32"
          :height="32"
          fit="cover"
          class="absolute left-0 top-0 z-10 aspect-square -translate-y-1/2 translate-x-1/2 overflow-hidden" />
        <h5 class="!m-0 line-clamp-2 !text-lg">{{ title }}</h5>
        <p class="!m-0 line-clamp-3 !text-sm opacity-60">{{ description }}</p>
      </div>
    </NuxtLink>
  </Transition>
</template>
