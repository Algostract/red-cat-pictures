<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug!.toString()
const { data: blog } = await useFetch<ContentDetails>(`/api/blog/${slug}`)

if (!blog.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if (blog.value.url !== '/blog/' + slug) {
  await navigateTo(blog.value.url, { redirectCode: 301 })
}

const title = `${blog.value.title}`
const description = `${blog.value.description}`
const url = 'https://redcatpictures.com'
const imageUrl = `https://ucarecdn.com/${blog.value.cover}/-/format/auto/-/preview/1200x630/center`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${url}/blog/${slug}`,
})

useSchemaOrg([
  defineArticle({
    headline: title,
    description: description,
    thumbnailUrl: imageUrl,
    datePublished: new Date(blog.value.publishedAt).toISOString(),
    dateModified: new Date(blog.value.modifiedAt).toISOString(),
    keywords: [],
  }),
])
</script>

<template>
  <article v-if="blog" class="w-full">
    <NuxtImg
      provider="uploadcare"
      :src="blog.cover"
      :alt="blog.title"
      :width="1280"
      :height="Math.round(1280 / (16 / 9))"
      fit="cover"
      format="auto"
      class="cover-img absolute left-0 aspect-[5/3] max-h-[20rem] w-screen object-cover" />
    <div class="invisible -left-4 aspect-[5/3] max-h-[20rem] w-screen" />
    <div class="content relative mx-auto max-w-4xl leading-relaxed">
      <h1 class="my-4 text-xl font-semi-bold md:text-3xl">{{ blog.title }}</h1>
      <div class="mb-2 mt-4 flex justify-between gap-8 text-black/60 dark:text-white/60 md:mt-8">
        <NuxtTime :datetime="blog.publishedAt" day="numeric" month="short" year="numeric" />
        <span class="text-right text-base">
          Updated on
          <NuxtTime :datetime="blog.modifiedAt" day="numeric" month="short" year="numeric" />
        </span>
      </div>
      <MarkdownContent :content="blog.markdown" />
    </div>
  </article>
</template>

<style scoped>
.cover-img {
  view-transition-name: selected-episode;
}
</style>
