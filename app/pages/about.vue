<script setup lang="ts">
// import { differenceInYears, formatDuration } from 'date-fns'

const title = `About Us`
const description = `Details About Aratrik Nandy Professional Product Photographer`
const {
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/about.webp`

useHead({
  bodyAttrs: {
    class: 'scrollbar-hidden',
  },
})

useSeoMeta({
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description,
  ogImage: imageUrl,
  ogUrl: siteUrl + '/about',
})

/* const DOE = '2021-01-01'
const now = useNow()
const experience = computed(() => {
  return formatDuration({ years: differenceInYears(now.value, DOE) }, { format: ['years'] })
}) */

const { data: clients } = await useFetch('/api/client')
</script>

<template>
  <section class="relative flex flex-col justify-between lg:flex-row">
    <div class="mb-4 mt-28 flex flex-col justify-center gap-4 px-4 lg:mb-12 lg:mt-36 lg:pl-8">
      <h1 class="text-xl font-semi-bold lg:text-2xl">Hello,</h1>
      <h2 class="text-2xl lg:text-4xl">I'm Aratrik Nandy</h2>
      <h2 class="text-lg lg:text-2xl">CEO & Product Photographer</h2>
      <h3>Our Story</h3>
      <p>
        RED CAT PICTURES opened with the ambition to transform how brands present their products through compelling imagery, through our Product and Food Photography and Product Videography we create
        brands that connect with their customers. The studio was founded by Aratrik Nandy renowned for his expertise in food and product photography.
      </p>
      <h3>Mission & Vision</h3>
      <p>
        Our mission is to nurture the essence of your brand by crafting high-quality product photography and videography that resonate with audiences and boost conversions. We envision setting new
        benchmarks in visual storytelling, marrying artistic creativity with cutting-edge technical excellence.
      </p>
      <h3>What We Do</h3>
      <p>
        At Red Cat Pictures, we specialize in: <br /><strong>Product & Food Photography</strong> From e-commerce flat-lays to gourmet food spreads, we highlight every detail and texture. <br /><strong
          >Product and Food Videography:</strong
        >
        Short advertisement films, commercials, and social media reels designed to engage and inform potential clients. RED CAT PICTURES excels at industry leading product videography in India.
        <br /><strong>CGI-Like Imagery:</strong> Premium product photos with depth and separation achieved through controlled lighting and post-production <br /><strong
          >Creative Direction & Styling:</strong
        >
        Art direction, prop styling, and bespoke concepts aligned with your brand’s core identity.
      </p>
      <h3>Our Studio</h3>
      <p>
        Based in Kolkata, our in-house facility features cutting-edge cameras, controlled lighting environments, and a variety of backdrops—ideal for lifestyle shots, white-background e-commerce
        images, and everything in between that makes RED CAT PICTURES Kolkata’s best product photography and videography studio.
      </p>
      <h3>Our Approach</h3>
      <p>
        We blend meticulous planning with spontaneous creativity: every shoot begins with a collaborative briefing to define objectives, followed by precise lighting setups and artful styling to
        capture your product’s best side. Post-production ensures pixel-perfect results, all delivered with a fast turnaround and transparent pricing.
      </p>
      <h3>Meet the Team</h3>
      <p>
        <strong>Aratrik Nandy, CEO & Product Photographer</strong> Aratrik brings a keen eye for detail and a passion for storytelling through images.
        <strong>Swarup Ghosh, VFX Specialist</strong> Swarup has experience in VFX industry for around 5 years and worked for several well known brands.
        <strong>Kinjal Adhikary, Assistant Director</strong> Kinjal brings his immersive knowledge about film-making. His insights and unique sense of creativity regarding our product videography
        always adds an extra layer to our projects.
      </p>
      <h3>Our Clients</h3>
      <p>
        We’ve had the privilege of working with brands such as
        <template v-for="({ id, name, website, logo }, index) in clients" :key="id">
          <NuxtLink
            v-if="extractUploadcareId(logo)"
            :href="website ? `${website}?utm_source=redcatpictures.com` : ''"
            target="__blank"
            external
            class="relative size-16 overflow-hidden whitespace-nowrap rounded-full bg-white px-3 py-1 transition-colors duration-200 ease-in-out hover:!bg-primary-400 hover:!text-white dark:bg-black">
            {{ name }} </NuxtLink
          >{{ index !== clients.length - 1 ? ', ' : '' }}
        </template>
        —delivering versatile, professional imagery that drives results.
      </p>
      <h3>Get Started</h3>
      <p>Ready to elevate your brand imagery? Book a session today and let Red Cat Pictures bring your products to life through stunning photography and videography.</p>
    </div>
    <div class="relative -left-2 z-10 flex h-fit w-screen shrink-0 flex-col items-end justify-start bg-black lg:left-9 lg:max-w-[36rem]">
      <figure class="w-full">
        <NuxtImg
          provider="ipx"
          src="/images/hero-1.webp"
          alt="Aratrik Nandy, CEO & Product Photographer"
          :width="576"
          :height="Math.round(576 / (3 / 4))"
          class="aspect-[3/4] w-full object-cover object-top grayscale hover:grayscale-0" />
        <figcaption>Aratrik Nandy, CEO & Product Photographer</figcaption>
      </figure>
      <figure class="w-full">
        <NuxtImg
          provider="ipx"
          src="/images/hero-2.webp"
          alt="Kinjal Adhikary, Assistant Director"
          :width="576"
          :height="576"
          class="aspect-square w-full object-cover object-top grayscale hover:grayscale-0" />
        <figcaption>Kinjal Adhikary, Assistant Director</figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
img {
  -webkit-transition: 1s -webkit-filter ease-out;
  -moz-transition: 1s -moz-filter ease-out;
  -moz-transition: 1s filter ease-out;
  -ms-transition: 1s -ms-filter ease-out;
  -o-transition: 1s -o-filter ease-out;
  transition:
    1s filter ease-out,
    1s -webkit-filter ease-out,
    2s opacity ease-in-out;
}

h3 {
  @apply text-base text-primary-500 lg:text-xl;
}

figcaption {
  @apply mx-auto py-2 text-center;
}

p {
  @apply text-base leading-loose;
}
</style>
