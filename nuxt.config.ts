// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-07-04',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'nuxt-splide',
    'nuxt-time',
  ],
  routeRules: {
    '/': { swr: true },
    '/_ipx/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/fonts/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/api/**': { cors: true },
    '/images/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/image/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/photo/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/video/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/blogs/**': { redirect: { to: '/episode/**', statusCode: 301 } },
    '/blog/**': { redirect: { to: '/episode/**', statusCode: 301 } },
    '/episode/sweet-stories-in-the-spotlight-the-new-sitala-mishtanna-bhandar-ad-shoot_1a515a2f-8cf0-80d6-8a8c-ea590bb15204': {
      redirect: { to: '/episode/sweet-photography-in-kolkata-the-new-sitala-mishtanna-bhandar-ad-shoot_1a515a2f-8cf0-80d6-8a8c-ea590bb15204', statusCode: 301 },
    },
    '/episode/metal-poster-shoot-unveiling-vfx-magic-for-pixelplate_1a615a2f-8cf0-807c-aaba-d1c77fa9b621': { redirect: { to: '/episode/', statusCode: 301 } },
    '/episode/**': { ssr: true },
  },
  runtimeConfig: {
    app: {
      version: '',
    },
    public: {
      scripts: {
        googleAnalytics: {
          id: '',
        },
      },
    },
    private: {
      rootDir: '',
      notionApiKey: '',
      notionClientDbId: '',
      notionContentDbId: '',
    },
  },
  nitro: {
    compressPublicAssets: true,
    storage: {
      fs: {
        driver: 'fs',
        base: './static',
      },
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      // link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  icon: {
    componentName: 'NuxtIcon',
    provider: 'server',
    mode: 'svg',
    customCollections: [
      {
        prefix: 'local',
        dir: './app/assets/icons',
      },
    ],
  },
  image: {
    uploadcare: {
      cdnURL: 'https://ucarecdn.com',
      quality: 'smart',
      format: 'auto',
    },
  },
  scripts: {
    registry: {
      googleAnalytics: true,
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },
  site: {
    name: 'RED CAT PICTURES',
    url: 'https://redcatpictures.com',
  },
  robots: {
    disallow: ['/_nuxt/'],
  },
  pwa: {
    scope: '/',
    base: '/',
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    manifest: {
      name: 'RED CAT PICTURES',
      short_name: 'RED CAT PICTURES',
      description: 'Nurture the essence of your product with our photography & videography services in kolkata',
      theme_color: '#CD2D2D',
      background_color: '#FFFFFF',
      orientation: 'portrait',
      shortcuts: [
        {
          name: 'Book a Session by Call',
          short_name: 'Book Session (Call)',
          description: 'Book a photography/videography session by call',
          url: 'tel:+91801-727-5285',
          icons: [{ src: '/pwa/phone-v2.png', sizes: '512x512' }],
        },
        {
          name: 'Book a Session by Whatsapp',
          short_name: 'Book Session (Whatsapp)',
          description: 'Book a photography/videography session by whatsapp',
          url: 'https://wa.me/918017275285',
          icons: [{ src: '/pwa/whatsapp-v2.png', sizes: '512x512' }],
        },
      ],
      icons: [
        {
          src: '/pwa/icon-48-v2.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-72-v2.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-96-v2.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-128-v2.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-192-v2.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-384-v2.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-512-v2.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/pwa/icon-maskable-48-v2.png',
          sizes: '48x48',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-72-v2.png',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-96-v2.png',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-128-v2.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-192-v2.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-384-v2.png',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/pwa/icon-maskable-512-v2.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
      screenshots: [
        {
          src: '/pwa/screenshot-desktop-1-v2.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 1',
        },
        {
          src: '/pwa/screenshot-desktop-2-v2.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 2',
        },
        {
          src: '/pwa/screenshot-desktop-3-v2.webp',
          sizes: '1024x576',
          type: 'image/webp',
          form_factor: 'wide',
          label: 'Screenshot 3',
        },
        {
          src: '/pwa/screenshot-mobile-1-v2.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 1',
        },
        {
          src: '/pwa/screenshot-mobile-2-v2.webp',
          sizes: '576x1024',
          type: 'image/webp',
          form_factor: 'narrow',
          label: 'Screenshot 2',
        },
        {
          src: '/pwa/screenshot-mobile-3-v2.webp',
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
  splide: {
    theme: 'core',
  },
})
