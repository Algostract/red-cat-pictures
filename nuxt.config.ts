// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-gtag',
    'nuxt-icons',
    'nuxt-splide',
  ],

  routeRules: {
    '/': { prerender: true },
    '/_ipx/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/images/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/fonts/**': { headers: { 'cache-control': 'max-age=31536000' } },
  },

  runtimeConfig: {
    app: {
      version: '',
    },
  },

  nitro: {
    compressPublicAssets: true,
  },

  image: {
    uploadcare: {
      cdnURL: 'https://ucarecdn.com',
      quality: 'smart',
      format: 'auto',
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },

  site: {
    name: 'Red Cat Pictures',
    url: 'https://redcatpictures.com',
  },

  pwa: {
    scope: '/',
    base: '/',
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Red Cat Pictures',
      short_name: 'Red Cat Pictures',
      description: 'Aratrik Nandy is a Professional Photographer/Videographer',
      theme_color: '#CABC7C',
      background_color: '#CABC7C',
      orientation: 'portrait',
      shortcuts: [
        {
          name: 'Book a Session by Call',
          short_name: 'Book Session (Call)',
          description: 'Book a photography/videography session by call',
          url: 'tel:+91801-727-5285',
          icons: [{ src: '/pwa/phone.png', sizes: '512x512' }],
        },
        {
          name: 'Book a Session by Whatsapp',
          short_name: 'Book Session (Whatsapp)',
          description: 'Book a photography/videography session by whatsapp',
          url: 'https://wa.me/918017275285',
          icons: [{ src: '/pwa/whatsapp.png', sizes: '512x512' }],
        },
      ],
      icons: [
        {
          src: '/pwa/icon-48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-maskable-48.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-72.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-96.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-384.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      screenshots: [
        {
          src: '/pwa/screenshot-desktop-1.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 1',
        },
        {
          src: '/pwa/screenshot-desktop-2.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 2',
        },
        {
          src: '/pwa/screenshot-desktop-3.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 3',
        },
        {
          src: '/pwa/screenshot-mobile-1.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 1',
        },
        {
          src: '/pwa/screenshot-mobile-2.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 2',
        },
        {
          src: '/pwa/screenshot-mobile-3.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 3',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{html,css,js,jpg,png,svg,webp,ico}'],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'NetworkFirst',
        },
      ],
      navigateFallback: undefined,
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      type: 'module',
      enabled: false,
      suppressWarnings: false,
      navigateFallback: undefined,
    },
  },

  gtag: {
  },

  splide: {
    theme: 'core',
  },

  compatibilityDate: '2024-07-11',
})