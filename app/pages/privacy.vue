<script setup lang="ts">
const title = `Privacy Policy`
const description = `Our Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website`
const {
  public: { siteUrl },
} = useRuntimeConfig()

useHead({
  bodyAttrs: {
    class: 'scrollbar-hidden',
  },
})

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogUrl: `${siteUrl}/privacy`,
})

/* const lastUpdated = buildTime

const sections = [
  {
    title: '1. Introduction',
    content: `
      This Privacy Policy applies to our website and services and explains how we collect, use,
      disclose, and protect your Personal Information. By using our site, you consent to this policy.
    `,
  },
  {
    title: '2. Information We Collect',
    content: `
      <ul class="list-disc list-inside">
        <li><strong>Personal Identifiers:</strong> name, address, email, phone number, date of birth.</li>
        <li><strong>Account Information:</strong> email, mobile number, KYC documents, bank/payment details.</li>
        <li><strong>Customer Transaction Data:</strong> order details, transaction history.</li>
        <li><strong>Technical Data:</strong> IP address, browser, device, cookies, usage logs.</li>
      </ul>
    `,
  },
  {
    title: '3. How We Use Your Information',
    content: `
      <ul class="list-disc list-inside">
        <li>To process payments, transactions, and deliver services.</li>
        <li>For customer support, fraud prevention, KYC and regulatory compliance.</li>
        <li>To send you updates, offers, and newsletters (you can unsubscribe anytime).</li>
        <li>To analyze usage patterns, improve services, and enhance security.</li>
      </ul>
    `,
  },
  {
    title: '4. Cookies & Tracking',
    content: `
      We use cookies (session and persistent) for authentication, preferences,
      analytics, fraud detection, and security. You may disable cookies via browser settings,
      but some features may be affected.
    `,
  },
  {
    title: '5. Third‑Party Disclosures',
    content: `
      We share your information with:
      <ul class="list-disc list-inside">
        <li>Payment processors, banks, and regulatory authorities (e.g., RBI, as required).</li>
        <li>Affiliated and parent companies under common control.</li>
        <li>Legal parties, such as in response to subpoenas or fraud investigations.</li>
      </ul>
    `,
  },
  {
    title: '6. Data Security & Retention',
    content: `
      We implement industry-standard security measures and retain personal information only
      as long as necessary or required by law. You may request deletion of your data subject
      to legal/regulatory obligations.
    `,
  },
  {
    title: '7. Your Rights & Policy Changes',
    content: `
      You have rights to access, correct, or delete your data, withdraw consent, and file grievances.
      We update this policy periodically; changes take effect immediately and notices are posted here.
    `,
  },
] */

const { data } = await useAPI<{
  privacy: {
    content: string
    lastUpdated: string
  }
}>(`/api/complience`)
</script>

<template>
  <section class="mx-auto mb-10 mt-28 max-w-4xl px-4 py-12 lg:mt-36">
    <h1 class="mb-8 w-fit text-2xl font-semi-bold md:text-3xl lg:mx-auto">Privacy Policy</h1>
    <NuxtTime :datetime="data!.privacy.lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ data!.privacy.lastUpdated }}</NuxtTime>
    <!--   <div v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="font-semibold mb-2 text-xl text-primary-500">{{ section.title }}</h2>
      <div v-html="section.content" />
    </div> -->
    <MarkdownContent :content="data!.privacy.content" />
  </section>
</template>
