<script setup lang="ts">
import { useRuntimeConfig } from '#app'

const title = `RED CAT PICTURES | Elevate Your Brand Image`
const description = `Nurture the essence of your product with our photography & videography services in kolkata`
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
  defineLocalBusiness({
    '@type': 'EntertainmentBusiness',
    name: 'RED CAT PICTURES',
    description: description,
    image: `${url}/previews/landing.webp`,
    logo: url + '/logo-dark.png',
    url: 'https://redcatpictures.com',
    address: {
      streetAddress: '17 NS Road, Vivekananda pally near Joyram Bhavan, rajpur sonarpur',
      addressLocality: 'Kolkata',
      addressRegion: 'WB',
      postalCode: '700146',
      addressCountry: 'IN',
    },
    sameAs: ['https://wa.me/c/918910489578', 'https://www.facebook.com/redcatxpictures', 'https://www.instagram.com/redcatxpictures', 'https://maps.app.goo.gl/uWqh8LjcF5ez4WZY8'],
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Home', item: '/' },
      { name: 'Episode', item: '/episode' },
    ],
  }),
])

useWebNotification()

async function getExistingSubscription() {
  const config = useRuntimeConfig()
  const vapidKey = config.public.vapidKey

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    })
    await $fetch('/api/notification/subscription', {
      method: 'POST',
      body: subscription.toJSON(),
    })
  } else {
    await $fetch('/api/notification/subscription', {
      method: 'POST',
      body: subscription.toJSON(),
    })
  }
  return subscription
}

onMounted(async () => {
  await getExistingSubscription()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaManifest />
  <NuxtPwaAssets />
  <NuxtLoadingIndicator color="#CD2D2D" />
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

body::-webkit-scrollbar {
  @apply hidden;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-600 dark:bg-dark-600;
}

html {
  @apply relative overflow-x-hidden scroll-smooth;
}

body {
  @apply relative min-h-screen overflow-x-hidden bg-light-400 fill-black font-main text-black dark:bg-dark-400 dark:fill-white dark:text-white;
}

svg.iconify--local {
  @apply !m-0 !box-content;
}

.scrollbar-hidden {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.scrollbar-hidden::-webkit-scrollbar {
  @apply /* Safari and Chrome */ hidden;
}
</style>
