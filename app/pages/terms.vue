<script setup lang="ts">
const title = `Terms and Conditions`
const description = `Our Terms and Conditions explain your rights and obligations`
const {
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
  ogUrl: `${siteUrl}/terms`,
})

const lastUpdated = 'June 17, 2025'

const sections = [
  {
    title: '1. Introduction',
    content: `
      By accessing or using our website/services, you agree to be bound by these Terms & Conditions ("Terms"). 
      These Terms include our Privacy Policy. If you disagree, you must stop using the Service immediately.
    `,
  },
  {
    title: '2. Use of Services',
    content: `
      <ul class="list-disc list-inside">
        <li>You agree to provide complete and accurate registration and business information.</li>
        <li>We may suspend or terminate your access for non-compliance.</li>
        <li>You consent to receiving transactional or promotional communications, with the right to opt-out.</li>
      </ul>
    `,
  },
  {
    title: '3. Fees & Billing',
    content: `
      <ul class="list-disc list-inside">
        <li>Fees are displayed in your dashboard and exclusive of applicable taxes.</li>
        <li>Invoices are issued monthly. Disputes must be raised within 7 days.</li>
        <li>We may vary fees at our discretion; FX rates and conversion charges apply where relevant.</li>
      </ul>
    `,
  },
  {
    title: '4. Intellectual Property',
    content: `
      You retain ownership of your content. We grant you a limited, revocable license to use our platform, but you may not reverse engineer or misuse platform IP.
    `,
  },
  {
    title: '5. Limitations of Liability',
    content: `
      <ul class="list-disc list-inside">
        <li>To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential losses.</li>
        <li>Our total aggregate liability will not exceed the fees you've paid to us in the prior 12 months.</li>
      </ul>
    `,
  },
  {
    title: '6. Indemnification',
    content: `
      You shall indemnify and hold us harmless from any claims, costs, or losses arising from your use of Services, content, or breach of Terms.
    `,
  },
  {
    title: '7. Termination & Suspension',
    content: `
      We may suspend or terminate your access immediately if:
      <ul class="list-disc list-inside">
        <li>You breach these Terms;</li>
        <li>Your actions are unlawful or high-risk;</li>
        <li>We’re legally compelled to do so.</li>
      </ul>
    `,
  },
  {
    title: '8. Governing Law',
    content: `
      These Terms are governed by the laws of India, and any disputes shall be resolved in courts located in Kolkata.
    `,
  },
  {
    title: '9. Changes to Terms',
    content: `
      We may modify these Terms by posting the updated version. Continued use after an update implies acceptance.
    `,
  },
]
</script>

<template>
  <section class="mx-auto mb-10 mt-28 max-w-4xl px-4 py-12 lg:mt-36">
    <h1 class="font-semibold mx-auto mb-8 w-fit text-2xl md:text-3xl">Terms & Conditions</h1>
    <NuxtTime :datetime="lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ lastUpdated }}</NuxtTime>

    <div v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="font-semibold mb-2 text-xl text-primary-500">{{ section.title }}</h2>
      <div v-html="section.content" />
    </div>
  </section>
</template>
