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
    // '@nuxtjs/i18n',
    '@nuxtjs/mcp-toolkit',
    '@nuxtjs/mdc',
    '@nuxtjs/seo',
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    'magic-regexp/nuxt',
    (_, nuxt) => {
      const isTres = nuxt.options.vue.compilerOptions?.isCustomElement

      nuxt.options.vue.compilerOptions = nuxt.options.vue.compilerOptions || {}
      nuxt.options.vue.compilerOptions.isCustomElement = (tag: string) => {
        // Uses `/^(video-|media-|dash-|hls)/` so it matches both `hls-video` and `hlsjs-video`
        return /^(video-|media-|dash-|hls)/.test(tag) || (typeof isTres === 'function' ? isTres(tag) : false)
      }
    },
  ],
  vite: {
    server: {
      allowedHosts: true,
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
    rollupConfig: {
      plugins: [vue()],
    },
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      '*/3 * * * *': ['sync:resource'],
      '*/7 * * * *': ['notify:content'],
    },
  },
  routeRules: {
    '/': { isr: 3600 },
    '/_ipx/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/fonts/**': { headers: { 'cache-control': 'max-age=31536000' } },
    '/api/**': { cors: true },
    '/image': { redirect: { to: '/project', statusCode: 301 } },
    '/image/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/photos': { redirect: { to: '/project', statusCode: 301 } },
    '/photos/**': { redirect: { to: '/photo/**', statusCode: 301 } },
    '/photo': { redirect: { to: '/project', statusCode: 301 } },
    '/photo/**': { isr: 3600 },
    '/videos': { redirect: { to: '/project', statusCode: 301 } },
    '/videos/**': { redirect: { to: '/video/**', statusCode: 301 } },
    '/video': { redirect: { to: '/project', statusCode: 301 } },
    '/video/**': { isr: 3600 },
    '/project/**': { isr: 3600 },
    '/episodes/**': { redirect: { to: '/episode/**', statusCode: 301 } },
    '/episode/**': { isr: 3600 },
    '/blogs/**': { redirect: { to: '/blog/**', statusCode: 301 } },
    '/blog/**': { isr: 3600 },
    '/about': { isr: 3600 },
    '/terms': { isr: 86400 },
    '/privacy': { isr: 86400 },
    '/cancellation': { isr: 86400 },
    '/license': { isr: 86400 },
  },
  runtimeConfig: {
    meta: {
      version: '',
      buildTime: '',
    },
    public: {
      siteUrl: '',
      cdnUrl: '',
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
      novuApi: '',
      novuApiKey: '',
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
    ipx: {
      baseURL: `${process.env.NUXT_PUBLIC_CDN_URL}/media/image`,
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
    preference: 'dark',
    fallback: 'light',
    classSuffix: '',
  },
  mcp: {
    name: 'RED CAT PICTURES MCP Server',
    version: '1.0.0',
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
    srcDir: '../public/services',
    filename: 'sw-main.ts',
    strategies: 'injectManifest',
    injectRegister: 'auto',
    registerType: 'autoUpdate',
    includeManifestIcons: false,
    manifest: {
      name: 'RED CAT PICTURES',
      short_name: 'RED CAT PICTURES',
      description: 'Tech-enabled Creative Media Agency',
      theme_color: '#CD2D2D',
      background_color: '#FFFFFF',
      display: 'fullscreen',
      shortcuts: [
        {
          name: 'Book a Session',
          short_name: 'Book a Session',
          description: 'Book a Session of Photography/Videography',
          url: '/?action=connect',
          icons: [{ src: '/pwa/phone-v2.png', sizes: '512x512' }],
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
    injectManifest: {
      globPatterns: ['**/*.{js,json,css,html,txt,svg,png,ico,webp,woff,woff2,ttf,eot,otf,wasm}'],
      globIgnores: ['manifest**.webmanifest'],
      maximumFileSizeToCacheInBytes: 3000000,
    },
    devOptions: {
      type: 'module',
      enabled: false,
      suppressWarnings: false,
    },
  },
  splide: {
    theme: 'core',
  },
  ...nativeConfig,
})
