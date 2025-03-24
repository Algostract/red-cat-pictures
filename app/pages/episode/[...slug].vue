<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug!.toString()
const { data: episode } = await useFetch(`/api/episode/${slug}`)

if (!episode.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = `${episode.value.title}`
const description = `${episode.value.description}`
const url = 'https://redcatpictures.com'
const imageUrl = `https://ucarecdn.com/${episode.value.cover}/-/format/auto/-/preview/1200x630/center`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${url}/episode/${slug}`,
})

useSchemaOrg([
  defineArticle({
    headline: title,
    description: description,
    thumbnailUrl: imageUrl,
    datePublished: episode.value.publishedAt,
    dateModified: episode.value.modifiedAt,
    keywords: [],
  }),
])
</script>

<template>
  <article v-if="episode" class="w-full">
    <NuxtImg
      provider="uploadcare"
      :src="episode.cover"
      :alt="episode.title"
      :width="1280"
      :height="Math.round(1280 / (16 / 9))"
      fit="cover"
      format="auto"
      class="absolute left-0 aspect-[5/3] max-h-[20rem] w-screen object-cover" />
    <div class="invisible -left-4 aspect-[5/3] max-h-[20rem] w-screen" />
    <div class="content relative mx-auto max-w-4xl leading-relaxed">
      <h1 class="mt-4">{{ episode.title }}</h1>
      <div class="mb-2 mt-4 flex justify-between gap-8 text-black/60 dark:text-white/60 md:mt-8">
        <NuxtTime :datetime="episode.publishedAt" day="numeric" month="short" year="numeric" />
        <span class="text-right text-base">
          Updated on
          <NuxtTime :datetime="episode.modifiedAt" day="numeric" month="short" year="numeric" />
        </span>
      </div>
      <MarkdownContent :content="episode.content" />
    </div>
  </article>
</template>

<style lang="css">
.content h1 {
  @apply my-4 text-xl font-semi-bold md:text-3xl;
}

.content h2 {
  @apply my-3 text-2xl font-semi-bold;
}

.content h3 {
  @apply my-2 text-xl font-semi-bold text-alert-600;
}

.content h4 {
  @apply my-1 text-lg font-semi-bold;
}

.content p {
  @apply my-2 font-light opacity-80 md:my-4 md:text-[1.125rem];
}

.content > img {
  @apply mx-auto my-4 aspect-video max-h-[18rem] w-full rounded-md object-cover md:my-8;
}

.content aside {
  @apply my-2 flex items-start gap-1 rounded bg-dark-600/20 p-4;
}

.content aside > img {
  @apply w-7;
}

.content aside > p {
  @apply my-0;
}

.content strong {
  @apply font-semi-bold;
}

.content ol {
  @apply ml-8 list-decimal;
}

.content ul {
  @apply ml-8 list-disc;
}

.content a {
  @apply underline underline-offset-1;
}

.content h3 > a {
  @apply no-underline;
}

.content blockquote {
  @apply rounded border-l-4 border-primary-500 pl-4;
}
</style>
