<script setup lang="ts">
const title = `Cancellation & Refund Policy`
const description = `Our Cancellation & Refund Policy explains cancellation rights and refund eligibility and process.`
const {
  app: { buildTime },
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/landing.webp`

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
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/refund`,
})

const lastUpdated = buildTime

const sections = [
  {
    title: '1. Cancellation of Services',
    content: `
      You may cancel your booking or service request at any time prior to the scheduled start date by contacting us using the details provided below. Please note that the booking fee is non-refundable in the event of cancellation.
    `,
  },
  {
    title: '2. Refund Eligibility',
    content: `
    All transactions are final. Once a transaction is completed, no refunds will be issued under any circumstances.
  `,
  },
]
</script>

<template>
  <section class="mx-auto mb-10 mt-28 max-w-4xl px-4 py-12 lg:mt-36">
    <h1 class="mb-8 w-fit text-2xl font-semi-bold md:text-3xl lg:mx-auto">Cancellation & Refund Policy</h1>
    <NuxtTime :datetime="lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ lastUpdated }} </NuxtTime>

    <div v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="mb-2 text-xl font-semi-bold text-primary-500">{{ section.title }}</h2>
      <div v-html="section.content" />
    </div>
  </section>
</template>
