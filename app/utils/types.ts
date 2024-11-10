export type Categories = 'commercial' | 'food' | 'product'

export interface FilePhoto {
  name: string
  id: string
  title: string
  category: Categories
  width: number
  height: number
}

export interface Photo extends Omit<FilePhoto, 'width' | 'height'> {
  aspectRatio: number
}

export interface Position {
  row: { start: number; span: number }
  col: { start: number; span: number }
}

export interface GalleryPhoto {
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
