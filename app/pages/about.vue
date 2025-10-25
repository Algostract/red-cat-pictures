<script setup lang="ts">
import type { Member } from '~/components/Card/Member.vue'
// import { differenceInYears, formatDuration } from 'date-fns'

const title = `About Us`
const description = `Our team, vision, and clients`
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
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/about`,
})

/* const DOE = '2021-01-01'
const now = useNow()
const experience = computed(() => {
  return formatDuration({ years: differenceInYears(now.value, DOE) }, { format: ['years'] })
}) */

const { data: clients } = await useAPI('/api/client')

const members: Member[] = [
  {
    name: 'Aratrik Nandy',
    designation: 'CEO & Lead Photographer',
    content: `Aratrik brings a keen eye for detail and a passion for storytelling through photos and videos.`,
    image: `/images/hero-1.webp`,
    socials: {
      linkedin: 'https://www.linkedin.com/in/aratrik-nandy-b72288323/',
    },
    isHero: true,
    animation: 'fly-in',
  },
  /*   {
      name: 'Kinjal Adhikary',
      designation: 'Assistant Director',
      content: `Kinjal brings his immersive knowledge about film-making. His unique sense brings adds an extra layer to our projects.`,
      image: `/images/hero-2.webp`,
      socials: {},
      isHero: false,
      animation: 'burn',
    },
    {
      name: 'Swarup Ghosh',
      designation: 'Art Director',
      content: `Swarup has experience in VFX industry for around 5 years and worked for several well known brands.`,
      image: `/images/hero-3.webp`,
      socials: {
        linkedin: 'https://www.linkedin.com/in/swarup-ghosh-48910425b',
      },
      isHero: false,
      animation: 'burn',
    }, */
  {
    name: 'Avishek Das',
    designation: 'Script Writer',
    content: `Avishek crafts scripts with engaging stories and rich narratives, giving each project a distinctive and compelling voice.`,
    image: `/images/hero-5.webp`,
    socials: {},
    isHero: false,
    animation: 'burn',
  },
  {
    name: 'Shirsendu Bairagi',
    designation: 'CTO & System Architect',
    content: `Shirsendu builds sleek websites, apps, and automation systems that boost efficiency and simplify operations.`,
    image: `/images/hero-4.webp`,
    socials: {
      instagram: 'https://www.instagram.com/shirsendu_bairagi/',
      youtube: 'https://www.youtube.com/@shirsendu_bairagi',
      x: 'https://x.com/shirsendu_baira',
      linkedin: 'https://www.linkedin.com/in/shirsendu-bairagi/',
      website: 'https://shirsendu-bairagi.dev/',
    },
    isHero: false,
    animation: 'burn',
  },
  {
    name: 'Aishik Kar',
    designation: 'Coordinator',
    content: `Aishik keeps every production on track, expertly managing teams and details to guarantee smooth project execution.`,
    image: `/images/hero-6.webp`,
    socials: {},
    isHero: false,
    animation: 'burn',
  },
  {
    name: 'Avijit Sardar',
    designation: 'Photographer',
    content: `Avijit captures memorable moments with creativity and precision, turning every frame into a striking visual story.`,
    image: `/images/hero-7.webp`,
    socials: {},
    isHero: false,
    animation: 'burn',
  },
]
</script>

<template>
  <div class="mx-4">
    <section class="mt-28 md:mt-36">
      <!-- Hero: single parent grid -->
      <div class="grid grid-cols-2 gap-10">
        <!-- Left: Our Story / About Text -->
        <div class="col-span-2 md:col-span-1">
          <h2 class="mb-4 text-3xl font-bold text-primary-500">Our Story</h2>
          <p class="mb-5">
            RED CAT PICTURES was founded by Aratrik Nandy to revolutionize brand imagery. Through our product and food photography and videography, we help brands forge deeper connections with their
            audience.
          </p>
          <h3 class="font-semibold mb-2 mt-8 text-xl">Mission & Vision</h3>
          <p class="mb-5">
            Our mission is to elevate your brand with striking visuals that drive engagement and sales. We aim to lead the industry in creative storytelling backed by technical mastery.
          </p>
          <h3 class="font-semibold mb-2 mt-8 text-xl">What We Do</h3>
          <ul class="mb-5 list-inside list-disc space-y-1 text-base">
            <li><strong>Product & Food</strong> Photography: E-commerce flat-lays to gourmet spreads.</li>
            <li><strong>Videography:</strong> Short ads, commercials, and social reels that captivate.</li>
            <li><strong>CGI-Style</strong> Imagery: High-end shots with dynamic lighting and expert retouching.</li>
            <li><strong>Creative</strong> Direction: Art direction, styling, and custom concepts aligned with your identity.</li>
          </ul>
          <h3 class="font-semibold mb-2 mt-8 text-xl">Our Studio</h3>
          <p class="mb-5">
            Located in Kolkata, our studio boasts advanced cameras, versatile backdrops, and controlled lighting—perfect for everything from clean white-background shots to lifestyle scenes.
          </p>
          <h3 class="font-semibold mb-2 mt-8 text-xl">Our Approach</h3>
          <p class="mb-5">
            We start each project with a collaborative briefing, follow with precise lighting and styling, and finish with meticulous post-production. Expect fast turnarounds and clear pricing.
          </p>
          <h3 class="font-semibold mb-2 mt-8 text-xl">Our Clients</h3>
          <p>
            We’ve had the privilege of working with brands such as
            <template v-for="({ id, name, website, logo }, idx) in clients" :key="id">
              <NuxtLink
                v-if="extractUploadcareId(logo)"
                :href="website ? `${website}?utm_source=redcatpictures.com` : ''"
                target="__blank"
                external
                class="font-semibold mx-1 underline transition-colors duration-200 hover:text-primary-400">
                {{ name }} </NuxtLink
              >{{ idx !== clients.length - 1 ? ',' : '' }}
            </template>
            —delivering versatile, professional imagery that drives results.
          </p>
        </div>
        <!-- Right: Hero Member only -->
        <div class="col-span-2 md:col-span-1">
          <CardMember
            v-for="{ name, designation, content, image, socials, animation } in members.filter((m) => m.isHero)"
            :key="name"
            :name="name"
            :designation="designation"
            :content="content"
            :image="image"
            :socials="socials"
            :animation="animation"
            :is-hero="true" />
        </div>
      </div>
    </section>
    <!-- Team section (excluding hero), 3 columns on md+ -->
    <section class="mt-16">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <CardMember
          v-for="{ name, designation, content, image, socials, animation } in members.filter((m) => !m.isHero)"
          :key="name"
          :name="name"
          :designation="designation"
          :content="content"
          :image="image"
          :socials="socials"
          :animation="animation"
          :is-hero="false" />
      </div>
    </section>
  </div>
</template>

<style scoped>
h3 {
  @apply my-2 text-xl text-primary-500 lg:text-xl;
}

figcaption {
  @apply mx-auto py-2 text-center;
}

p {
  @apply text-base leading-loose;
}
</style>
