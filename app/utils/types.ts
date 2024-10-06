export type Categories = 'commercial' | 'food' | 'product'

export interface Photo {
  name: string
  id: string
  title: string
  category: Categories
  aspectRatio: number
}

export interface Position {
  row: { start: number; span: number }
  col: { start: number; span: number }
}

export interface GallaryPhoto {
  name: string
  id: string
  alt: string
  dynamicClass: string
  aspectRatio: number
}

export interface Video {
  poster: string
  sources: {
    src: string
    type: string
  }[]
}
