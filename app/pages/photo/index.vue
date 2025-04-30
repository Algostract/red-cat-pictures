<script setup lang="ts">
const { data: photos } = await useFetch('/api/photo', { default: () => [] })

const title = `Photos`
const description = `Photo Gallery`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = photos.value?.length ? `https://ucarecdn.com/${photos.value[0]?.id}/-/format/auto/-/scale_crop/1200x630/` : `${siteUrl}/preview/landscape.webp`

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

const allUniquePhotos = usePhoto(photos, { section: 'gallery' })
const allPhotos = computed(() => {
  const needed = (12 - (allUniquePhotos.value.length % 12)) % 12
  const indexToSlice = allUniquePhotos.value.findIndex(({ category }) => category === 'food')
  const extra = allUniquePhotos.value.slice(indexToSlice, indexToSlice + needed)

  return allUniquePhotos.value.concat(extra)
})

const slideCounts = ['3', '4', '6'] as const

const photoSlides = computed(() => {
  const slides = slideCounts.map((noOfSlides) => {
    const slides: Photo[][] = new Array(parseInt(noOfSlides)).fill(null).map((_) => [])

    allPhotos.value.forEach((photo, index) => {
      slides[index % parseInt(noOfSlides)]!.push(photo)
    })

    return slides
  })

  return {
    3: slides[0],
    4: slides[1],
    6: slides[2],
  }
})

const activePhotoName = useState()
</script>

<template>
  <main class="relative mx-auto flex min-h-screen w-full flex-col items-center justify-center">
    <section class="relative z-0 mt-2 bg-light-400 dark:bg-dark-400 md:mt-6">
      <div class="relative z-10 flex gap-2">
        <!-- For Small Screen Devices -->
        <template v-for="slideCount in slideCounts">
          <div
            v-for="(slidePhotos, index) in photoSlides[slideCount]"
            :key="index"
            class="flex-1 flex-col gap-2"
            :class="{
              'flex md:hidden': slideCount == '3',
              'hidden md:flex lg:hidden': slideCount == '4',
              'hidden lg:flex': slideCount == '6',
            }">
            <NuxtLink v-for="{ id, title, description, url } in slidePhotos" :key="id" :to="url" @click="activePhotoName = title">
              <NuxtImg
                provider="uploadcare"
                :src="id"
                :alt="description"
                :width="480"
                :height="Math.round(480 / (3 / 4))"
                fit="cover"
                format="auto"
                loading="lazy"
                quality="smart"
                class="w-full rounded-sm bg-light-600 object-cover dark:bg-dark-500"
                :class="{ active: activePhotoName === title }" />
            </NuxtLink>
          </div>
        </template>
        <!-- For Large Screen Devices -->
      </div>
    </section>
  </main>
</template>

<style scoped>
img.active {
  view-transition-name: selected-photo;
}
</style>
