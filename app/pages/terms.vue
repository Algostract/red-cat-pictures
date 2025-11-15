<script setup lang="ts">
const title = `Terms and Conditions`
const description = `Our Terms and Conditions explain your rights and obligations`
const {
  public: { siteUrl },
} = useRuntimeConfig()

useHead({
  bodyAttrs: { class: 'scrollbar-hidden' },
})

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  ogUrl: `${siteUrl}/terms`,
})

const { data } = await useAPI<{
  terms: {
    content: string
    lastUpdated: string
  }
}>(`/api/complience`)
</script>

<template>
  <section class="mx-auto mt-28 max-w-4xl px-4 py-12 lg:mt-36">
    <h1 class="mb-8 w-fit text-2xl font-semi-bold md:text-3xl lg:mx-auto">Terms & Conditions</h1>
    <NuxtTime :datetime="data!.terms.lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ data!.terms.lastUpdated }}</NuxtTime>
    <MarkdownContent :content="data!.terms.content" />
  </section>
</template>
