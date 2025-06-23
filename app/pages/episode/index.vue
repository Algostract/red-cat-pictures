<script setup lang="ts">
const { data: episodes } = await useFetch('/api/episode')

const title = `Episodes of all behind the Scenes & Stories`
const description = `Read our episodes for behind-the-scenes insights, project stories, and expert tips on photography and videography.`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = episodes.value?.length ? `https://ucarecdn.com/${episodes.value[0]?.cover}/-/format/auto/-/scale_crop/1200x630/` : `${siteUrl}/preview/landscape.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/episode`,
})

const activeEpisode = useState()
</script>

<template>
  <section class="relative">
    <ul v-if="episodes?.length" class="mx-auto mb-8 mt-28 grid h-full w-fit max-w-[76rem] grow grid-cols-1 justify-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="{ id, cover, title, description, url, createdAt, publishedAt, modifiedAt } in episodes" :key="id">
        <CardContent
          :id="id"
          :cover="cover"
          :title="title"
          :description="description"
          :url="url"
          :created-at="createdAt"
          :published-at="publishedAt"
          :modified-at="modifiedAt"
          :is-active="activeEpisode === id"
          @active="activeEpisode = id" />
      </li>
    </ul>
    <div v-else class="mx-auto flex h-full w-full max-w-[76rem] grow items-center justify-center">
      <span>No Episode Published Yet!</span>
    </div>
  </section>
</template>
