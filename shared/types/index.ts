export type Category = 'ecommerce' | 'product' | 'food'
export type Service = 'photo' | 'video'

export interface FilePhoto {
  id: string
  title: string
  description: string
  width: number
  height: number
  category: Category
  gallery: null | number
  featured: null | number
}

export interface Photo extends Omit<FilePhoto, 'width' | 'height'> {
  aspectRatio: number
  url: string
}

export interface PhotoDetails extends Omit<Photo, 'featured' | 'gallery'> {
  title: string
}

export interface GalleryPhoto {
  id: string
  title: string
  description: string
  dynamicClass: string
  aspectRatio: number
  url: string
}

export interface Position {
  row: { start: number; span: number }
  col: { start: number; span: number }
}

export type FileSources = {
  [codec in Codec]?: { type: string } & {
    [resolution in Resolution]?: Orientation[]
  }
}

export interface FileVideo {
  id: string
  title: string
  description: string
  type: 'hero' | 'feature'
  poster: string
  sources: FileSources
}

export interface Source {
  src: string
  type: string
  media: string
  codec: Codec
  resolution: Resolution
  orientation: Orientation
}

export interface Video extends Omit<FileVideo, 'sources'> {
  sources: Source[]
  url: string
}

export interface VideoDetails extends Video {
  title: string
}

export interface ServicePrice {
  title: string
  price: number
  unit: 'photo' | 'video' | 'session'
  points: { icon: string; title: string }[]
}

export type Price = Record<Category, Record<Service, ServicePrice[]>>

export interface Content {
  id: string
  title: string
  description: string
  cover: string
  createdAt: string
  modifiedAt: string
  publishedAt: string
  url: string
}

export interface ContentDetails extends Content {
  markdown: string
}
