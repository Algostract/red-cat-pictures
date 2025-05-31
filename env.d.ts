interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production'
  readonly BROWSER_ENDPOINT?: string
  readonly NOTION_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
