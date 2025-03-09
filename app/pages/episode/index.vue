<script setup lang="ts">
const { data: episodes } = await useFetch('/api/episode')

const title = `Episodes of all behind the Scenes & Stories`
const description = `Read our episodes for behind-the-scenes insights, project stories, and expert tips on photography and videography.`
const url = 'https://redcatpictures.com'
const imageUrl = episodes.value?.length ? `https://ucarecdn.com/${episodes.value[0]?.cover}/-/format/auto/-/scale_crop/1280x640/` : `${url}/preview/landscape.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${url}/episode`,
})
</script>

<template>
  <section class="mb-8 flex-1">
    <ul v-if="episodes?.length" class="mx-auto mt-24 grid w-fit max-w-[76rem] grid-cols-1 justify-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="{ id, cover, title, description, url, createdAt } in episodes" :key="id">
        <CardEpisode :cover="cover" :title="title" :description="description" :url="url" :created-at="createdAt" />
      </li>
    </ul>
    <div v-else class="mx-auto h-full w-fit max-w-[76rem] items-center justify-center">No Episode Published Yet!</div>
  </section>
</template>
