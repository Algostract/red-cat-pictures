<script setup lang="ts">
const title = `Cancellation & Refund Policy`
const description = `Our Cancellation & Refund Policy explains cancellation rights and refund eligibility and process.`
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
  ogUrl: `${siteUrl}/refund`,
})

const { data } = await useAPI<{
  cancellation: {
    content: string
    lastUpdated: string
  }
}>(`/api/complience`)
</script>

<template>
  <section class="mx-auto mt-28 max-w-4xl px-4 py-12 lg:mt-36">
    <h1 class="mb-8 w-fit text-2xl font-semi-bold md:text-3xl lg:mx-auto">Cancellation & Refund Policy</h1>
    <NuxtTime :datetime="data!.cancellation.lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ data!.cancellation.lastUpdated }} </NuxtTime>
    <!-- 
    <div v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="mb-2 text-xl font-semi-bold text-primary-500">{{ section.title }}</h2>
      <div v-html="section.content" />
    </div> -->

    <MarkdownContent :content="data!.cancellation.content" />
  </section>
</template>
