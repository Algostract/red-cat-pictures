export type Categories = 'food' | 'product'

export interface Photo {
  name: string
  id: string
  title: string
  category: Categories
}

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
