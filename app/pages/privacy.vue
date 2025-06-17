<script setup lang="ts">
const title = `Privacy Policy`
const description = `Our Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/landing.webp`

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
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/privacy`,
})
</script>

<template>
  <section class="mx-auto mb-10 mt-28 max-w-4xl px-4 lg:mt-36">
    <h1 class="mx-auto mb-8 w-fit text-2xl font-semi-bold md:text-3xl">Privacy Policy</h1>

    <div class="space-y-6">
      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">1. Introduction</h2>
        <p>
          Welcome to RED CAT PICTURES ("we", "us", "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
          you visit our website <a href="https://redcatpictures.com" class="text-blue-600 hover:underline">redcatpictures.com</a>.
        </p>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">2. Information We Collect</h2>
        <ul class="list-inside list-disc space-y-2">
          <li><strong>Personal Data:</strong> Name, email address, phone number, and business details you provide when booking services or contacting us.</li>
          <li>
            <strong>Usage Data:</strong> Information about your interaction with our website, such as IP address, browser type, pages visited, and timestamps, collected via cookies and analytics
            tools.
          </li>
        </ul>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">3. How We Use Your Information</h2>
        <ul class="list-inside list-disc space-y-2">
          <li>To provide, operate, and maintain our services and website.</li>
          <li>To process bookings, inquiries, and communicate with you.</li>
          <li>To improve user experience and personalize content.</li>
          <li>To send you updates, newsletters, and promotional materials (you may opt out at any time).</li>
          <li>To monitor and analyze usage trends and website performance.</li>
        </ul>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">4. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website and store certain information. You can configure your browser to refuse cookies or alert you when cookies
          are being sent.
        </p>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">5. Third-Party Services</h2>
        <p>
          We may share your information with third-party service providers to facilitate our services (e.g., payment processors, analytics providers). These parties are obligated to protect your
          information and use it only for the purposes we specify.
        </p>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">6. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your information. However, no method of transmission over the Internet is completely secure, so we cannot guarantee absolute
          security.
        </p>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">7. Children’s Privacy</h2>
        <p>Our website is not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13.</p>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">8. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.</p>
      </div>

      <div>
        <h2 class="font-semibold mb-2 text-xl text-primary-500">9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <address class="not-italic">
          <p>RED CAT PICTURES</p>
          <p>Email: <a href="mailto:info@redcatpictures.com" class="text-blue-600 hover:underline">redcatpictures24@gmail.com</a></p>
        </address>
      </div>
    </div>
  </section>
</template>
