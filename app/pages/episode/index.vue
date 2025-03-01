<script setup lang="ts">
const route = useRoute()
const { data: episodes } = await useAsyncData(route.path, () => queryCollection('notion').all())

const title = `All Episodes`
const description = `All ${episodes.value?.length} Episodes of Red Cat Pictures`
const url = 'https://redcatpictures.com'

if (!episodes.value?.length) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: `https://ucarecdn.com/${episodes.value[0]?.cover}/-/format/webp/-/scale_crop/1280x640/`,
  twitterImage: `https://ucarecdn.com/${episodes.value[0]?.cover}/-/format/webp/-/scale_crop/1280x640/`,
  ogUrl: `${url}/episode`,
})
</script>

<template>
  <div>
    <AppHeader />
    <main class="relative mx-auto mb-4 flex min-h-screen max-w-[90rem] flex-col gap-4 overflow-hidden p-4 !pb-0 md:mb-8 lg:p-16 lg:pt-28">
      <section class="flex-1">
        <ul class="mx-auto grid w-fit max-w-[76rem] grid-cols-1 justify-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="{ id, cover, title, content, url, createdAt } in episodes" :key="id">
            <CardEpisode :cover="cover" :title="title" :description="content" :url="url" :created-at="createdAt" />
          </li>
        </ul>
      </section>
      <AppFooter />
    </main>
  </div>
</template>
