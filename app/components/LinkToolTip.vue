<script setup lang="ts">
const props = defineProps<{
  activeLink?: {
    url: string
    title: string
  }
}>()

const {
  public: { cdnUrl },
} = useRuntimeConfig()
const { $api } = useNuxtApp()
const url = computed(() => props.activeLink?.url)
const data = ref<MetaData>()
const isDark = useDark()

watch(url, async (value) => {
  if (!value) return

  data.value = await $api<MetaData>('/api/external/meta', { query: { url: value } })
})

const title = computed(() => data.value?.ogTitle ?? props.activeLink?.title)
const description = computed(() => data.value?.ogDescription)
const lastUpdated = computed(() => data.value?.lastUpdated)
const image = computed<string>(() => data.value?.ogImage?.toString() ?? `${cdnUrl}/image/f_jpeg&fit_cover&s_2560x1440/placeholder-blank`)
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
    <span
      v-if="activeLink"
      class="absolute left-1/2 z-50 flex w-[256px] -translate-x-1/2 flex-col overflow-hidden !whitespace-normal border border-black bg-light-500 !no-underline dark:bg-dark-500 md:w-[320px]"
      tabindex="-1">
      <NuxtImg :src="image" :alt="activeLink.title" width="640" fit="contain" class="aspect-[13/7] w-full overflow-hidden bg-light-600 object-cover object-top dark:bg-dark-500" />
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
        <p class="!m-0 line-clamp-3 !text-sm opacity-80">{{ description }}</p>
        <span v-if="lastUpdated" class="!m-0 !text-sm opacity-60">
          Updated
          <NuxtTime :datetime="lastUpdated" relative />
        </span>
      </div>
    </span>
  </Transition>
</template>
