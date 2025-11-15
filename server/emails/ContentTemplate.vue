<script setup lang="ts">
// import { Html, Head, Preview, Body, Container, Section, Text, Tailwind, Img, Link, Font } from '@vue-email/components'

defineProps<{
  fromCompanyName: string
  fromEmail: string
  fromCompanyLogo: string
  fromCompanyLink: string
  emailSubject: string
  contentTitle: string
  contentImage: string
  contentUrl: string
  unsubscribeUrl: string
  toPersonName: string
  toEmail: string
}>()

const referTag = '?ref=mail-content'

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
            url: 'https://fonts.gstatic.com/s/oxanium/v19/RrQQboN_4yJ0JmiMe2zE0YBB.woff2',
            format: 'woff2',
          }"
          :font-weight="400"
          font-style="normal" />
        <title>{{ emailSubject }}</title>
      </Head>
      <Preview>{{ contentTitle }}</Preview>

      <Body class="font-body bg-white text-black">
        <Container class="px-3 py-5">
          <!-- Logo -->
          <Section class="justify-left mt-2 flex">
            <Img :src="fromCompanyLogo" alt="{{ fromCompanyName }} logo" class="mx-auto size-24" width="96" height="96" />
          </Section>
          <!-- Heading -->
          <Section class="text-left">
            <Text class="mt-4 text-2xl font-semi-bold leading-tight">
              {{ emailSubject }}
            </Text>
            <Text class="mt-4 text-center text-lg leading-tight"> Hello {{ toPersonName }}, we have just published a new post. </Text>
          </Section>
          <!-- Feature Image -->
          <Section class="mt-4">
            <Img :src="contentImage" alt="{{ imageAlt }}" class="w-full rounded-lg" />
          </Section>
          <!-- Call to Action -->
          <Section class="mt-2 text-center">
            <Text class="text-left text-base leading-snug">
              {{ contentTitle }}
            </Text>
            <Link :href="contentUrl + referTag" class="inline-block bg-primary-500 px-4 py-1 text-white" target="_blank"> Read More</Link>
          </Section>
          <!-- Footer -->
          <Section class="mt-4 text-right">
            <Text class="mt-2">
              <Link :href="unsubscribeUrl + '?email=' + toEmail" class="text-gray-400 text-xs"> Unsubscribe </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
</template>
