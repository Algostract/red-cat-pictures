import vue from '@vitejs/plugin-vue'

const host = process.env.TAURI_DEV_HOST || 'localhost'
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

const nativeConfig =
  process.env.PLATFORM_ENV === 'native'
    ? {
        ssr: false,
        devServer: { host },
        ignore: ['**/src-tauri/**', '**/node_modules/**', '**/dist/**', '**/.git/**', '**/.nuxt/**', '**/.output/**'],
        vite: {
          clearScreen: false,
          envPrefix: ['VITE_', 'TAURI_'],
          server: {
            strictPort: true,
            port,
            host: host || false,
            hmr: host
              ? {
                  protocol: 'ws',
                  host,
                  port,
                }
              : undefined,
          },
        },
        nitro: {
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
          prerender: {
            routes: [],
          },
        },
      }
    : {}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  experimental: {
    viewTransition: true,
  },
  devtools: { enabled: true },
  modules: [
    // '@hannoeru/nuxt-otel',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils/module',
    '@nuxtjs/color-mode',
    '@nuxtjs/mdc',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'magic-regexp/nuxt',
    'nuxt-nodemailer',
    'nuxt-splide',
  ],
  nitro: {
    compressPublicAssets: true,
    storage: {
      fs: {
        driver: 'fs',
        base: './static',
      },
      /*  r2: {
         driver: 's3',
         accessKeyId: '',
         secretAccessKey: '',
         endpoint: '',
         bucket: '',
         region: '',
       }, */
    },
    rollupConfig: {
      plugins: [vue()],
    },
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '*/5 * * * *': ['sync:resource', 'workflow:quotation'],
      '*/10 * * * *': ['prospect:marketing', 'notify:content'],
    },
  },
  routeRules: {
    '/': { isr: 3600 },
    '/_ipx/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/fonts/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/api/**': { cors: true },
    '/image/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/photos/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/photo/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/videos/**': { redirect: { to: '/video/**', statusCode: 301 } },
    '/video/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/episodes/**': { redirect: { to: '/episode/**', statusCode: 301 } },
    '/episode/**': { isr: 3600 },
    '/blogs/**': { redirect: { to: '/blog/**', statusCode: 301 } },
    '/blog/**': { isr: 3600 },
    '/about': { isr: 3600 },
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
      // cdnUrl: 'http://localhost:3500/media',
      cdnUrl: 'https://cdn.redcatpictures.com/media',
      scripts: {
        googleAnalytics: {
          id: '',
        },
      },
      vapidKey: '',
    },
    private: {
      serverValidationKey: '',
      notionDbId: '',
      vapidKey: '',
      vapidSubject: '',
      emailMetaData: '',
      facebookPageId: '',
      facebookAccessToken: '',
      paymentUpiInfo: '',
      r2AccessKeyId: '',
      r2SecretAccessKey: '',
      r2Endpoint: '',
      r2Bucket: '',
      r2Region: '',
      documensoApi: '',
      documensoApiKey: '',
    },
  },
  icon: {
    componentName: 'NuxtIcon',
    provider: 'none',
    mode: 'svg',
    customCollections: [
      {
        prefix: 'local',
        dir: './app/assets/icons',
      },
    ],
    clientBundle: {
      scan: true,
    },
  },
  image: {
    provider: 'ipx',
    densities: [1, 2.5],
    ipx: {
      // baseURL: 'http://localhost:3500/media',
      baseURL: 'https://cdn.redcatpictures.com/media',
      modifiers: {
        format: 'auto',
        quality: 80,
        progressive: 'yes',
      },
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
  robots: {},
  pwa: {
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    manifest: {
      name: 'RED CAT PICTURES | Product, Food Photography & Videography in Kolkata, India',
      short_name: 'RED CAT PICTURES',
      description: 'Create your brand identity that speaks to your clients, with our product photography/videograpy service',
      theme_color: '#CD2D2D',
      background_color: '#FFFFFF',
      // orientation: 'natural',
      display: 'fullscreen',
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
      maximumFileSizeToCacheInBytes: 3000000,
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
    devOptions: {
      type: 'module',
      enabled: false,
      suppressWarnings: false,
    },
  },
  nodemailer: {
    from: '',
    host: '',
    port: '',
    secure: true,
    auth: {
      user: '',
      pass: '',
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  splide: {
    theme: 'core',
  },
  ...nativeConfig,
})
