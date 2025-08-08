<script setup lang="ts">
const title = `Terms and Conditions`
const description = `Our Terms and Conditions explain your rights and obligations`
const {
  app: { buildTime },
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

const lastUpdated = buildTime

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
        <li>Delivery timelines for photography/videography services are 10–20 days from shoot date and commence after the second installment.</li>
        <li>The Client or Agency representative must be present during the shoot for inspection; no changes will be accepted afterward.</li>
        <li>One-time changes are accepted; additional revisions or last-minute schedule changes will incur extra charges.</li>
        <li>In the event of reshoots required for quality improvement, extra charges apply as per additional shoot days.</li>
        <li>If creative freedom is interfered with, we are not responsible for unsatisfactory outcomes.</li>
        <li>The Client must supply undamaged products for the shoot; otherwise, we shall not be liable.</li>
        <li>Shoot services include up to 8 hours per day; additional days and costs apply if the scope is not met within this timeframe.</li>
        <li>We are not liable for data loss after one month from shoot date; liability is capped at the quoted service amount.</li>
      </ul>
    `,
  },
  {
    title: '3. Fees & Billing',
    content: `
      <ul class="list-disc list-inside">
        <li>Fees are displayed in your dashboard and exclusive of applicable taxes.</li>
        <li>Invoices are issued monthly. Disputes must be raised within 7 days of invoice date.</li>
        <li>We may vary fees at our discretion; FX rates and conversion charges apply where relevant.</li>
        <li>20% of the total amount is due in advance at booking; 70% due after final shoot; 10% due upon delivery of edited materials.</li>
        <li>Travel and accommodation charges must be paid in advance; logistics are handled by the Client.</li>
        <li>Editing and delivery will be put on hold if any payment is pending past its due date.</li>
      </ul>
    `,
  },
  {
    title: '4. Intellectual Property',
    content: `
      You retain ownership of your content. We grant you a limited, revocable license to use our platform, but you may not reverse engineer or misuse platform IP.
      <br/><br/>
      As the copyright holder of all Photos & Videos produced, we reserve the right to use these assets on our website and social media for promotional purposes.
    `,
  },
  {
    title: '5. Limitations of Liability',
    content: `
      <ul class="list-disc list-inside">
        <li>To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential losses.</li>
        <li>Our total aggregate liability will not exceed the fees you've paid to us in the prior 12 months.</li>
        <li>Liability for data loss due to technical faults or natural events is limited to the quoted amount for the affected service.</li>
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
        <li>Advanced payments are non-refundable in the event of cancellation or postponement by the Client.</li>
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
  <section class="mb-10 mt-28 max-w-4xl px-4 py-12 lg:mx-auto lg:mt-36">
    <h1 class="mb-8 w-fit text-2xl font-semi-bold md:text-3xl lg:mx-auto">Terms & Conditions</h1>
    <NuxtTime :datetime="lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ lastUpdated }}</NuxtTime>

    <div v-for="section in sections" :key="section.title" class="mb-8">
      <h2 class="mb-2 text-xl font-semi-bold text-primary-500">{{ section.title }}</h2>
      <div v-html="section.content" />
    </div>
  </section>
</template>
