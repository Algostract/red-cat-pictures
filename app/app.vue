<script setup lang="ts">
const title = `RED CAT PICTURES | Elevate Your Brand Image`
const description = `Nurture the essence of your product with our photography & videography services in kolkata`
const {
  public: { siteUrl },
} = useRuntimeConfig()

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
    url: siteUrl,
    name: title,
    description: description,
  }),
  defineLocalBusiness({
    '@type': 'EntertainmentBusiness',
    name: 'RED CAT PICTURES',
    description: description,
    image: `${siteUrl}/previews/landing.webp`,
    logo: siteUrl + '/logo-dark.png',
    url: siteUrl,
    address: {
      streetAddress: '17 NS Road, Vivekananda pally near Joyram Bhavan, rajpur sonarpur',
      addressLocality: 'Kolkata',
      addressRegion: 'WB',
      postalCode: '700146',
      addressCountry: 'IN',
    },
    sameAs: ['https://wa.me/c/918910489578', 'https://www.facebook.com/redcatxpictures', 'https://www.instagram.com/redcatxpictures', 'https://maps.app.goo.gl/uWqh8LjcF5ez4WZY8'],
  }),
])

const { isSupported, permissionGranted } = useWebNotification()

async function getExistingSubscription() {
  const config = useRuntimeConfig()

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: config.public.vapidKey,
    })
  }

  await $fetch('/api/notification/subscription', {
    method: 'POST',
    body: subscription.toJSON(),
  })

  return subscription
}

onMounted(async () => {
  if (isSupported.value && permissionGranted.value) await getExistingSubscription()
})

watch(permissionGranted, async (value) => {
  if (value) await getExistingSubscription()
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
  <LazyAppInstallPrompt hydrate-on-idle />
</template>

<style>
* {
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: 6px;
  @apply antialiased;
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
  @apply relative min-h-screen overflow-x-hidden bg-light-400 fill-black font-main text-black dark:bg-dark-400 dark:fill-white dark:text-white;
}

svg.iconify--local {
  @apply !m-0 !box-content;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.overlay {
  @apply after:fixed after:left-0 after:top-0 after:z-20 after:h-screen after:w-screen after:bg-gradient-to-b after:from-black/40 after:from-[3%] after:via-transparent after:via-20% after:to-black/40 after:to-[97%] after:content-[''];
}

.autoscroll-x {
  animation: scroll-x linear infinite;
}

.autoscroll-y {
  animation: scroll-y linear infinite;
}

@keyframes scroll-x {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes scroll-y {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-50%);
  }
}
</style>
