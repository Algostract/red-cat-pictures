<script setup lang="ts">
import { Html, Head, Preview, Body, Container, Section, Img, Text, Tailwind, Link, Font } from '@vue-email/components'

defineProps<{
  fromCompanyName: string
  fromPersonName: string
  fromEmail: string
  fromCompanyLogo: string
  fromCompanyPhone: string
  fromCompanyLink: string
  fromFeaturedPhotos: { id: string; title: string; description: string; image: string; url: string }[]
  emailSubject: string
  toCompanyName: string
  toPersonName: string
  toEmail: string
}>()

const referTag = '?ref=mail-prospect'

const tailwindConfig = {
  darkMode: 'class',
  theme: {
    fontSize: {
      '3xs': ['0.5rem', '0.5625rem'],
      '2xs': ['0.625rem', '0.75rem'],
      xs: ['0.75rem', '0.875rem'],
      sm: ['0.875rem', '1.0625rem'],
      base: ['1rem', '1.5rem'],
      lg: ['1.25rem', '1.5625rem'],
      xl: ['1.5rem', '1.875rem'],
      '2xl': ['2rem', '2.5rem'],
      '3xl': ['2.5rem', '3.125rem'],
      '4xl': ['3rem', '3.625rem'],
      '5xl': ['3.5rem', '4.1875rem'],
    },
    fontFamily: {
      main: ['Oxanium', 'sans-serif'],
      sub: ['Oxanium', 'sans-serif'],
    },
    fontWeight: {
      light: 300,
      regular: 400,
      'semi-bold': 500,
      bold: 600,
    },
    colors: {
      transparent: 'transparent',
      white: '#FFFFFF',
      light: {
        400: '#F8FAFC',
        500: '#F1F5F9',
        600: '#CBD5E1',
      },
      black: '#000000',
      dark: {
        400: '#171717',
        500: '#262626',
        600: '#404040',
      },
      primary: {
        400: '#FB3737',
        500: '#CD2D2D',
        600: '#813232',
      },
      success: {
        400: '#89E774',
        500: '#4AD42B',
        600: '#66BE52',
      },
      warning: {
        400: '#F0CD42',
        500: '#ECC113',
        600: '#D7B942',
      },
      alert: {
        400: '#F24067',
        500: '#E11D48',
        600: '#C02650',
      },
    },
    extend: {},
  },
}
</script>

<template>
  <Html lang="en">
    <Tailwind :config="tailwindConfig">
      <Head>
        <Font
          font-family="Oxanium"
          fallback-font-family="Verdana"
          :web-font="{
            url: 'https://fonts.gstatic.com/s/oxanium/v19/RrQQboN_4yJ0JmiMe2LE0Q.woff2',
            format: 'woff2',
          }"
          :font-weight="400"
          font-style="normal" />
        <title>{{ emailSubject }}</title>
      </Head>
      <Preview>{{ emailSubject }}</Preview>

      <Body class="font-body bg-white text-black">
        <Container class="px-3 py-5">
          <!-- Heading -->
          <Section>
            <Text class="font-head mb-6 text-left text-2xl leading-tight">
              {{ emailSubject }}
            </Text>
          </Section>
          <!-- Logo -->
          <Section class="mb-2 flex justify-center">
            <Img :src="fromCompanyLogo" alt="{{ fromCompanyName }} logo" class="mx-auto size-24" width="96" height="96" />
          </Section>
          <!-- Intro copy -->
          <Section class="mb-2 space-y-4">
            <Text class="text-base leading-relaxed"> Hello {{ toCompanyName }} Team, </Text>
            <Text class="text-base leading-relaxed">
              I’m {{ fromPersonName }} from
              <Link :href="`${fromCompanyLink}${referTag}`" :title="fromCompanyName" class="inline-block text-primary-400 underline" target="_blank">{{ fromCompanyName }}</Link
              >. We specialize in product videography and photography—delivering crisp, high‑resolution
              <Link :href="`${fromCompanyLink}/#featured-photos`" class="inline-block text-primary-400 underline" target="_blank">photos</Link>
              and short‑form
              <Link :href="`${fromCompanyLink}/#video-gallery`" class="inline-block text-primary-400 underline" target="_blank">videos</Link>
              <br />
              for e‑commerce, social media, and advertising. Whether on‑location or in‑studio, our full production and post‑production services ensure top‑quality assets, on time and within budget.
              Here are some of our work
            </Text>
            <!-- Product images row -->
            <Section class="relative mb-4 flex flex-row">
              <Link v-for="{ id, title, image, url } in fromFeaturedPhotos" :key="id" :href="`${fromCompanyLink}${url}${referTag}`" class="inline-block w-1/4" target="_blank">
                <Img :src="`https://ucarecdn.com/${image}/-/smart_resize/960x1440/`" :alt="title" class="w-full object-cover" />
              </Link>
            </Section>
            <Section class="mb-4 text-center">
              <Link :href="`${fromCompanyLink}/photo${referTag}`" class="inline-block rounded bg-primary-500 px-4 py-1 text-white" target="_blank"> Show More </Link>
            </Section>
            <Text class="text-base leading-relaxed"
              >I would appreciate a brief call to discuss strategies for enhancing your clients' visual marketing campaigns. Please advise on your availability.</Text
            >
          </Section>
          <!-- Sign‑off -->
          <Section class="mb-2 space-y-4">
            <Text class="text-base leading-relaxed">Thank you for your consideration.</Text>
            <Text class="text-base leading-relaxed">
              Best regards,<br />
              {{ fromPersonName }} (Lead Photographer)<br />
              Website:
              <Link :href="`${fromCompanyLink}${referTag}`" :title="fromCompanyName" class="inline-block underline" target="_blank">{{ fromCompanyLink }}</Link
              ><br />
              Phone: {{ fromCompanyPhone }}
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
