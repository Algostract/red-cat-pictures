import vue from '@vitejs/plugin-vue'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  future: {
    compatibilityVersion: 4,
  },
  experimental: {
    viewTransition: true,
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
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
    'nuxt-nodemailer',
    'nuxt-splide',
    '@tresjs/nuxt',
  ],
  nitro: {
    compressPublicAssets: true,
    storage: {
      fs: {
        driver: 'fs',
        base: './static',
      },
    },
    rollupConfig: {
      plugins: [vue()],
    },
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '*/5 * * * *': ['sync:resource', 'notify:content', 'prospect:marketing'],
    },
  },
  // FIXME: tempo fix remove when not needed
  vite: {
    server: {
      allowedHosts: true,
    },
    $server: {
      build: {
        rollupOptions: {
          output: {
            preserveModules: true,
          },
        },
      },
    },
  },
  routeRules: {
    '/': { swr: true },
    '/_ipx/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/fonts/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/api/**': { cors: true },
    '/image/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/photos/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/photo/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/videos/**': { redirect: { to: '/video/**', statusCode: 301 } },
    '/video/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/episodes/**': { redirect: { to: '/episode/**', statusCode: 301 } },
    '/episode/**': { ssr: true },
    '/blogs/**': { redirect: { to: '/blog/**', statusCode: 301 } },
    '/blog/**': { ssr: true },
    '/about': { ssr: true },
    '/terms': { prerender: true },
    '/privacy': { prerender: true },
    '/cancellation': { prerender: true },
  },
  runtimeConfig: {
    app: {
      version: '',
      buildTime: '',
    },
    public: {
      siteUrl: '',
      scripts: {
        googleAnalytics: {
          id: '',
        },
      },
      vapidKey: '',
    },
    private: {
      rootDir: '',
      serverValidationKey: '',
      notionDbId: '',
      vapidKey: '',
      vapidSubject: '',
      oauthClientId: '',
      oauthClientSecret: '',
      oauthRefreshToken: '',
      facebookAccessToken: '',
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
    provider: 'uploadcare',
    ipx: {},
    uploadcare: {
      cdnURL: 'https://ucarecdn.com',
      quality: 'smart',
      format: 'auto',
      progressive: 'yes',
      strip_meta: 'all',
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
    url: process.env.NUXT_PUBLIC_SITE_URL,
  },
  sitemap: {
    autoLastmod: true,
    sources: ['/api/__sitemap__/urls'],
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
      globPatterns: ['**/*.{html,css,js,jpg,jpeg,png,svg,webp,ico,mp3,wav,ogg,mp4,webm,mov,m4a,aac}'],
      runtimeCaching: [
        {
          urlPattern: /\.(?:html|js|css)$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'dynamic-assets',
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|webp|ico|mp3|wav|ogg|mp4|webm|mov|m4a|aac)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-assets',
            expiration: { maxEntries: 100, maxAgeSeconds: 7 * 24 * 60 * 60 },
          },
        },
      ],
      navigateFallback: '/',
      cleanupOutdatedCaches: true,
      importScripts: ['/sw-push.js'],
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
  nodemailer: {
    host: '',
    port: 0,
    secure: false,
    auth: {
      user: '',
      pass: '',
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
    },
  },
  splide: {
    theme: 'core',
  },
})
