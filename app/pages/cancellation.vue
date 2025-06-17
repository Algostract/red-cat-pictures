<script setup lang="ts">
const title = `Cancellation & Refund Policy`
const description = `Our Cancellation & Refund Policy explains cancellation rights and refund eligibility and process.`
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
  ogUrl: `${siteUrl}/refund`,
})

const data = reactive({
  address: `17 NS Road, 700146, near Joyram Bhavan,\nVivekananda Pally, Kolkata,\nWest Bengal 700146`,
  phone: '+91-891-048-9578',
  email: 'redcatpictures24@gmail.com',
})

const lastUpdated = 'June 17, 2025'

const sections = [
  {
    title: '1. Cancellation of Services',
    content: `
      You may cancel your booking or service request at any time before the start date. To cancel, please contact us using the details below. Cancellations made less than 24 hours before the scheduled service may incur a cancellation fee.
    `,
  },
  {
    title: '2. Refund Eligibility',
    content: `
      <ul class="list-disc list-inside">
        <li>Full refunds are issued for cancellations made at least 48 hours before service.</li>
        <li>Partial refunds (50%) apply for cancellations between 24-48 hours before service.</li>
        <li>No refund is provided for cancellations made within 24 hours of service start.</li>
      </ul>
    `,
  },
  {
    title: '3. Refund Process',
    content: `
      To request a refund, please email us at <a href="mailto:${data.email}" class="text-blue-600 hover:underline">${data.email}</a> or call <strong>${data.phone}</strong> with your booking reference. Once approved, refunds are credited to the original payment method.
    `,
  },
  {
    title: '4. Refund Timeline',
    content: `
      Refunds are processed within 5-7 business days after approval. Banks or payment providers may take additional 2-3 business days to reflect the refund in your account.
    `,
  },
  {
    title: '5. Non-Refundable Charges',
    content: `
      Service fees, transaction charges, and third-party processing fees are non-refundable. Any taxes paid are refunded only if permitted by law.
    `,
  },
  {
    title: '6. Disputes & Chargebacks',
    content: `
      If you believe there has been an error in processing your refund, contact us. In the event of a chargeback, we reserve the right to dispute the claim with your bank.
    `,
  },
]
</script>

<template>
  <section class="mx-auto mb-10 mt-28 max-w-4xl px-4 py-12 lg:mt-36">
    <h1 class="font-semibold mx-auto mb-8 w-fit text-2xl md:text-3xl">Cancellation & Refund Policy</h1>
    <NuxtTime :datetime="lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ lastUpdated }} </NuxtTime>

    <div v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="font-semibold mb-2 text-xl text-primary-500">{{ section.title }}</h2>
      <div v-html="section.content" />
    </div>
  </section>
</template>
