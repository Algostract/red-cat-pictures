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

export interface PhotoDetails extends Omit<Photo, 'featured' | 'gallery'> {
  title: string
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

export interface FileSourceItem {
  src: string
  type: string
}

export type FileSources = {
  [codec in Codec]?: {
    [resolution in Resolution]?: {
      [orientation in Orientation]?: FileSourceItem[]
    }
  }
}

export interface FileVideoItem {
  name: string
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
}

export interface Video {
  name: string
  type: 'hero' | 'feature'
  poster: string
  sources: Source[]
}

export interface VideoDetails extends Video {
  name: string
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

export interface Episode {
  id: string
  title: string
  cover: string
  createdAt: string
  modifiedAt: string
  publishedAt: string
  description: string
  url: string
}

export interface EpisodeDetails extends Episode {
  content: string
}
