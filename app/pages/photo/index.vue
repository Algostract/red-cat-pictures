<script setup lang="ts">
const { data: photos } = await useAPI('/api/photo', { default: () => [] })

const title = `Photos`
const description = `Photo Gallery`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = photos.value?.length ? `https://ucarecdn.com/${photos.value[0]?.image}/-/format/auto/-/scale_crop/1200x630/` : `${siteUrl}/preview/landscape.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/photo`,
})

const categoryOrder = ['food', 'ecommerce', 'product'] as Category[]
const groupedPhotos = computed(() => Object.groupBy(photos.value, (photo) => photo.category))

const activePhotoName = useState<string | null>()
</script>

<template>
  <main class="mx-auto min-h-screen w-full pt-20 md:pt-28">
    <!-- <LazySearchBar class="fixed bottom-4 left-1/2 z-50 -translate-x-1/2" hydrate-on-idle /> -->
    <section class="rounded-md bg-light-400 dark:bg-dark-400">
      <div v-for="category in categoryOrder" :key="category" class="mb-6 flex flex-col gap-3">
        <h2 class="font-semibold text-md text-center uppercase md:text-xl">{{ category }}</h2>
        <div class="columns-3 gap-2 md:columns-4 lg:columns-6">
          <div v-for="photo in groupedPhotos[category]" :key="photo.id" class="mb-2 overflow-hidden rounded-sm bg-light-600 duration-200 ease-in-out hover:scale-110 dark:bg-dark-500">
            <NuxtLink :to="photo.url" @click="activePhotoName = photo.title">
              <NuxtImg
                :src="photo.image"
                :alt="photo.description"
                :width="480"
                :height="Math.round(480 / photo.aspectRatio)"
                fit="cover"
                loading="lazy"
                :placeholder="[120, Math.round(120 / photo.aspectRatio), 'lightest', 25]"
                class="w-full object-cover"
                :class="{ active: activePhotoName === photo.title }" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
img.active {
  view-transition-name: selected-photo;
}

.break-inside-avoid-column {
  break-inside: avoid-column;
}
</style>
