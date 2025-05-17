<script setup lang="ts">
const { data: blogs } = await useFetch('/api/blog')

const title = `Blogs`
const description = `Read our Blogs for expert tips on photography and videography.`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = blogs.value?.length ? `https://ucarecdn.com/${blogs.value[0]?.cover}/-/format/auto/-/scale_crop/1200x630/` : `${siteUrl}/preview/landscape.webp`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/blog`,
})

const activeBlog = useState()
</script>

<template>
  <section class="relative">
    <ul v-if="blogs?.length" class="mx-auto mb-8 mt-28 grid h-full w-fit max-w-[76rem] grow grid-cols-1 justify-center gap-10 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="{ id, cover, title, description, url, createdAt, publishedAt, modifiedAt } in blogs" :key="id">
        <CardContent
          :id="id"
          :cover="cover"
          :title="title"
          :description="description"
          :url="url"
          :created-at="createdAt"
          :published-at="publishedAt"
          :modified-at="modifiedAt"
          :is-active="activeBlog === id"
          @active="activeBlog = id" />
      </li>
    </ul>
    <div v-else class="mx-auto flex h-full w-full max-w-[76rem] grow items-center justify-center">
      <span>No Blog Published Yet!</span>
    </div>
  </section>
</template>
