<script setup lang="ts">
const { data: images } = await useFetch('/api/image', { default: () => [] })

const route = useRoute()

const activeImageName = computed<string>(() => route.params.slug![0]!)
const activeImage = computed(() => images.value.find(({ name }) => name === activeImageName.value))

const title = `Image Gallery | ${activeImageName.value}`
const description = `${activeImage.value?.title}`
const url = 'https://redcatpictures.com'

useSeoMeta({
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description,
  ogImage: `https://ucarecdn.com/${activeImage.value?.id}/-/preview/1280x640/`,
  ogUrl: url + `/images/${activeImageName.value}`,
})
</script>

<template>
  <div v-if="activeImage">
    <main class="relative mx-auto flex h-screen w-screen max-w-[90rem] flex-col items-center justify-center overflow-hidden p-4 md:p-8">
      <NuxtImg
        provider="uploadcare"
        :src="activeImage.id"
        :alt="activeImage.title"
        :width="Math.round(720 * activeImage.aspectRatio)"
        :height="720"
        fit="fill"
        format="webp"
        loading="lazy"
        class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500 md:h-full md:w-auto" />
      <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
    </main>
  </div>
</template>
