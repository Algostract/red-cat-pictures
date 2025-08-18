<script setup lang="ts">
// import { differenceInYears, formatDuration } from 'date-fns'
import type { Member } from '~/components/Card/Member.vue'

const title = `About Us`
const description = `Our About Us describes our team, vision, what we do and clients`
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
  {
    name: 'Shirsendu Bairagi',
    designation: 'CTO & System Architect',
    content: `I Design, Develop, Deploy & Repeat`,
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
    name: 'Swarup Ghosh',
    designation: 'Art Director',
    content: `Swarup has experience in VFX industry for around 5 years and worked for several well known brands.`,
    image: `/images/hero-3.webp`,
    socials: {
      linkedin: 'https://www.linkedin.com/in/swarup-ghosh-48910425b',
    },
    isHero: false,
    animation: 'burn',
  },
  {
    name: 'Kinjal Adhikary',
    designation: 'Assistant Director',
    content: `Kinjal brings his immersive knowledge about film-making. His unique sense brings adds an extra layer to our projects.`,
    image: `/images/hero-2.webp`,
    socials: {},
    isHero: false,
    animation: 'burn',
  },
]
</script>

<template>
  <section class="relative flex flex-col justify-between lg:flex-row">
    <div class="mb-4 mt-28 grid grid-flow-col grid-cols-6 justify-center gap-6 px-4 md:grid-flow-row md:grid-rows-[repeat(auto,2)] lg:mb-12 lg:mt-36 lg:pl-8">
      <CardMember
        v-for="({ name, designation, content, image, socials, isHero, animation }, index) in members"
        :key="name"
        :name="name"
        :designation="designation"
        :content="content"
        :image="image"
        :socials="socials"
        :is-hero="isHero"
        :animation="animation"
        class="col-span-full"
        :class="isHero ? 'md:col-span-3 md:col-start-4' : `md:col-span-2 md:row-start-2 md:col-start-${index * 2 - 1}`" />
      <div class="col-span-full md:col-span-3 md:col-start-1 md:row-start-1 lg:mr-24">
        <h2 class="mb-2 text-xl text-primary-500 lg:mb-6 lg:text-3xl">Our Story</h2>
        <p>
          RED CAT PICTURES was founded by Aratrik Nandy to revolutionize brand imagery. Through our product and food photography and videography, we help brands forge deeper connections with their
          audience.
        </p>

        <h3>Mission & Vision</h3>
        <p>Our mission is to elevate your brand with striking visuals that drive engagement and sales. We aim to lead the industry in creative storytelling backed by technical mastery.</p>

        <h3>What We Do</h3>
        <p>
          At Red Cat Pictures, we specialize in:<br />
          <strong>Product & Food Photography:</strong> From e-commerce flat-lays to gourmet spreads, we capture every nuance.<br />
          <strong>Videography:</strong> Short ads, commercials, and social reels that captivate.<br />
          <strong>CGI-Style Imagery:</strong> High-end shots with dynamic lighting and expert retouching.<br />
          <strong>Creative Direction:</strong> Art direction, styling, and custom concepts aligned with your identity.
        </p>

        <h3>Our Studio</h3>
        <p>Located in Kolkata, our studio boasts advanced cameras, versatile backdrops, and controlled lighting—perfect for everything from clean white-background shots to lifestyle scenes.</p>

        <h3>Our Approach</h3>
        <p>We start each project with a collaborative briefing, follow with precise lighting and styling, and finish with meticulous post-production. Expect fast turnarounds and clear pricing.</p>

        <h3>Our Clients</h3>
        <p>
          We’ve had the privilege of working with brands such as
          <template v-if="clients">
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
          </template>
          —delivering versatile, professional imagery that drives results.
        </p>
      </div>
    </div>
  </section>
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
