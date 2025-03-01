<script setup lang="ts">
const { data: episodes } = await useFetch('/api/episode')

const title = `All Episodes`
const description = `All ${episodes.value?.length} Episodes of Red Cat Pictures`
const url = 'https://redcatpictures.com'
const image = episodes.value?.length ? `https://ucarecdn.com/${episodes.value[0]?.cover}/-/format/webp/-/scale_crop/1280x640/` : `${url}/preview/landscape.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: image,
  twitterImage: image,
  ogUrl: `${url}/episode`,
})
</script>

<template>
  <div>
    <AppHeader />
    <main class="relative mx-auto mb-4 flex min-h-screen max-w-[90rem] flex-col gap-4 overflow-hidden p-4 !pb-0 md:mb-8 lg:p-16">
      <section class="flex-1">
        <ul v-if="episodes?.length" class="mx-auto mt-24 grid w-fit max-w-[76rem] grid-cols-1 justify-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="{ id, cover, title, description, url, createdAt } in episodes" :key="id">
            <CardEpisode :cover="cover" :title="title" :description="description" :url="url" :created-at="createdAt" />
          </li>
        </ul>
        <div v-else class="mx-auto h-full w-fit max-w-[76rem] items-center justify-center">No Episode Published Yet!</div>
      </section>
      <AppFooter />
    </main>
  </div>
</template>
