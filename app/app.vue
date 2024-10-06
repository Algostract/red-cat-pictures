<script setup lang="ts">
const title = `Professional Food & Product photography/Videography in Kolkata`
const description = `Nurture the essence of your food & product with our photography & videography services in Kolkata`
const url = 'https://redcatpictures.com'

useSeoMeta({
  ogType: 'profile',
  ogImageWidth: 1280,
  ogImageHeight: 640,
  fbAppId: 966242223397117,
  twitterCard: 'summary_large_image',
  colorScheme: 'light dark',
})

useSchemaOrg([
  definePerson({
    name: 'Aratrik Nandy',
    description: 'He is a Professional Food & Product Photographer/Videographer',
    image: url + '/logo.png',
    sameAs: ['https://www.facebook.com/profile.php?id=61559002911290', 'https://www.instagram.com/redcatxpictures'],
  }),
  defineLocalBusiness({
    name: 'Aratrik Nandy',
    address: {
      streetAddress: '17 NS Road, Vivekananda pally near Joyram Bhavan, rajpur sonarpur',
      addressLocality: 'Kolkata',
      addressRegion: 'WB',
      postalCode: '700146',
      addressCountry: 'IN',
    },
    image: url + '/logo.png',
  }),
  defineWebPage({
    datePublished: new Date(2024, 1, 1).toISOString(),
    dateModified: new Date(2024, 1, 1).toISOString(),
    author: 'Shirsendu Bairagi',
  }),
  defineWebSite({
    url: url,
    name: title,
    description: description,
  }),
])
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaManifest />
  <NuxtPwaAssets />
  <!-- <NuxtLoadingIndicator /> -->
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <AppInstallPrompt />
</template>

<style>
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: 6px;
}

*::-webkit-scrollbar {
  @apply block size-[6px] bg-light-400 dark:bg-dark-400;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-600 dark:bg-dark-600;
}

html {
  @apply relative overflow-x-hidden scroll-smooth;
}

body {
  @apply relative min-h-screen overflow-x-hidden bg-light-400 font-main text-black dark:bg-dark-400 dark:text-white;
}

.nuxt-icon > svg {
  @apply !m-0;
}

.scrollbar-hidden {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>
