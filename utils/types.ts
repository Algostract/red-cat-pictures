export type Categories = 'food' | 'product'

export interface Position {
  row: { start: number; span: number }
  col: { start: number; span: number }
}

export interface GallaryImage {
  url: string
  alt: string
  dynamicClass: string
  autoScale: boolean
}
