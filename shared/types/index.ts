export type Category = 'ecommerce' | 'product' | 'food'
export type Service = 'photo' | 'video'

export interface FilePhoto {
  name: string
  id: string
  description: string
  width: number
  height: number
  category: Category
  gallery: null | number
  featured: null | number
}

export interface Photo extends Omit<FilePhoto, 'width' | 'height'> {
  aspectRatio: number
}

export interface GalleryPhoto {
  name: string
  id: string
  alt: string
  dynamicClass: string
  aspectRatio: number
}

export interface Position {
  row: { start: number; span: number }
  col: { start: number; span: number }
}

export type BreakpointKey = 'default' | 'md' | 'lg' | 'xl' | '2xl'

export type FileSources = {
  [key in BreakpointKey]?: {
    src: string
    type: string
  }[]
}

export interface FileVideoItem {
  type: 'hero' | 'feature'
  poster: string
  sources: FileSources
}

export interface Source {
  src: string
  type: string
  media: string
}

export interface VideoItem {
  type: 'hero' | 'feature'
  poster: string
  sources: Source[]
}

export interface ServicePrice {
  title: string
  price: number
  unit: 'photo' | 'video' | 'session'
  points: { icon: string; title: string }[]
}

export type Price = Record<Category, Record<Service, ServicePrice[]>>

export interface NotionEpisode {
  id: string
  created_time: string
  last_edited_time: string
  cover: {
    external: {
      url: string
    }
  }
  properties: {
    'Client name': {
      select: {
        name: string
      }
    }
    Status: {
      status: {
        name: 'Idea' | 'Drafting' | 'Ready for Review' | 'Ready to Publish' | 'Published' | 'Unpublished'
      }
    }
    'Content type': {
      select: {
        name: 'Blog article'
      }
    }
    'Publish date': {
      date: {
        start: string
      }
    }
    'Content name': {
      title: {
        plain_text: string
      }[]
    }
  }
}
