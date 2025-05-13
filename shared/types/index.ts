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
  cover: string | null
  createdAt: string
  modifiedAt: string
  publishedAt: string
  url: string
}

export interface ContentDetails extends Content {
  markdown: string
}

export interface MetaData {
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  logo: string | null
}

/* Server Only */
export const resourceTypes = ['prospect', 'client', 'project', 'content', 'model', 'studio'] as const

export type ResourceType = (typeof resourceTypes)[number]

export interface ResourceRecordMap {
  prospect: NotionProspect
  client: NotionProjectClient
  project: NotionProject
  content: NotionContent
  model: NotionModel
  studio: NotionStudio
}

export interface Resource<T extends ResourceType = ResourceType> {
  type: T
  notificationStatus: boolean
  record: ResourceRecordMap[T]
}

export type NotionDB = { [K in ResourceType]: string }

type NotionMediaAsset =
  | {
      type: 'file'
      file: {
        url: string
        expiry_time: string
      }
    }
  | {
      type: 'external'
      external: {
        url: string
      }
    }
  | null

export interface NotionProspect {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: NotionMediaAsset
  icon: NotionMediaAsset
  properties: {
    Name: {
      title: {
        type: string
        text: {
          content: string
          link: null
        }
        plain_text: string
        href: null
      }[]
    }
    Status: {
      type: 'status'
      status: {
        name: 'Unverified' | 'Verified' | 'Initiate' | 'Communicate' | 'Converted' | 'Cancelled'
      }
    }
    Type: {
      type: 'select'
      select: {
        name: string
      }
    }
    Website: {
      type: 'url'
      url: string
    }
    Instagram: {
      type: 'url'
      url: string
    }
    LinkedIn: {
      type: 'url'
      url: string
    }
    Email: { type: 'email'; email: string }

    Whatsapp: {
      type: 'url'
      url: string
    }
    Phone: {
      type: 'phone_number'
      phone_number: string
    }
  }
  url: string
  public_url: null
}

export interface NotionProjectClient {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: NotionMediaAsset
  icon: NotionMediaAsset
  properties: {
    Name: {
      title: {
        type: string
        text: {
          content: string
          link: null
        }
        plain_text: string
        href: null
      }[]
    }
    'Point of Contact': {
      id: string
      type: string
      select: {
        id: string
        name: string
        color: string
      }
    }
    Website: {
      url: string
    }
    Instagram: {
      url: string
    }
    Email: {
      email: string
    }
    Phone: {
      phone_number: string
    }
    Project: {
      id: string
      type: string
      relation: { id: string }[]
      has_more: boolean
    }
    Profit: {
      id: string
      type: string
      rollup: {
        type: string
        number: null
        function: string
      }
    }
  }
  url: string
  public_url: null
}

export interface NotionProject {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: NotionMediaAsset
  icon: NotionMediaAsset
  properties: {
    Name: {
      title: {
        type: string
        text: {
          content: string
          link: null
        }
        plain_text: string
        href: null
      }[]
    }
  }
  url: string
  public_url: null
}

export interface NotionContent {
  id: string
  created_time: string
  last_edited_time: string
  cover: NotionMediaAsset
  icon: NotionMediaAsset
  properties: {
    Name: {
      title: {
        plain_text: string
      }[]
    }
    Type: {
      select: {
        name: 'Episode' | 'Blog'
      }
    }
    Status: {
      status: {
        name: 'Plan' | 'Draft' | 'Ready' | 'Publish' | 'Unpublish'
      }
    }
    'Publish date': {
      date: {
        start: string
      }
    }
    'Client name': {
      select: {
        name: string
      }
    }
  }
}

export interface NotionModel {
  id: string
  created_time: string
  last_edited_time: string
  cover: NotionMediaAsset
  icon: NotionMediaAsset
  properties: {
    Name: { type: 'title'; title: string[] }
    Email: { type: 'email'; email: string }
    Phone: { type: 'phone_number'; phone_number: string }
    Instagram: { type: 'url'; url: string }
    Project: { type: 'relation'; relation: string[]; has_more: false }
  }
  url: string
  public_url: null
}

export interface NotionStudio {
  id: string
  created_time: string
  last_edited_time: string
  cover: NotionMediaAsset
  icon: NotionMediaAsset
  properties: {
    Name: { type: 'title'; title: string[] }
    Email: { type: 'email'; email: string }
    Phone: { type: 'phone_number'; phone_number: string }
    Instagram: { type: 'url'; url: string }
    Project: { type: 'relation'; relation: string[]; has_more: false }
  }
  url: string
  public_url: null
}

export interface NotificationSubscription {
  endpoint: string
  expirationTime: null
  keys: {
    p256dh: string
    auth: string
  }
}

export interface EmailSubscription {
  name: string
  email: string
}
