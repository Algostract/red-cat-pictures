export type Category = 'ecommerce' | 'product' | 'food'
export type Service = 'photo' | 'video'
export type Orientation = 'portrait' | 'landscape'

export interface Photo {
  id: string
  title: string
  image?: string
  description: string
  category: Category
  gallery: boolean
  featured: null | number
  aspectRatio: number
  url: string
}

export interface PhotoDetails extends Omit<Photo, 'featured' | 'gallery'> {
  title: string
}

export interface GalleryPhoto {
  id: string
  title: string
  image: string
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

export interface Source {
  src: string
  type: string
  media: string
  codec: Codec
  resolution: Resolution
  orientation: Orientation
}

export interface Video {
  id: string
  title: string
  description: string
  type: 'hero' | 'feature'
  poster?: string
  category: Category
  gallery: boolean
  featured: null | number
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
  lastUpdated: string
}

export interface PushNotificationSubscription {
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

export interface WhatsappSubscription {
  name: string
  phone: string
}

/* Server Only */
export const resourceTypes = ['prospect', 'client', 'project', 'content', 'asset'] as const

export type ResourceType = (typeof resourceTypes)[number]

export type NotionDB = { [K in ResourceType]: string }

export interface ResourceRecordMap {
  prospect: NotionProspect
  client: NotionProjectClient
  project: NotionProject
  content: NotionContent
  asset: NotionAsset
}

export interface Resource<T extends ResourceType = ResourceType> {
  type: T
  notificationStatus: boolean
  record: ResourceRecordMap[T]
}

type NotionImage =
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
  cover: NotionImage
  icon: NotionImage
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
  cover: NotionImage
  icon: NotionImage
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
  cover: NotionImage
  icon: NotionImage
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
  cover: NotionImage
  icon: NotionImage
  properties: {
    Name: {
      title: {
        plain_text: string
      }[]
    }
    Status: {
      status: {
        name: 'Plan' | 'Draft' | 'Ready' | 'Publish' | 'Unpublish'
      }
    }
    Type: {
      select: {
        name: 'Episode' | 'Blog'
      }
    }
    'Publish date': {
      date: {
        start: string
      }
    }
    Project: {
      relation: { id: string }[]
      has_more: false
    }
    Asset: {
      relation: { id: string }[]
      has_more: true
    }
  }
}

export interface NotionAsset {
  id: string
  created_time: string
  last_edited_time: string
  cover: NotionImage
  icon: NotionImage
  properties: {
    Index: { number: number }
    'Project Index': {
      rollup: {
        array: {
          number: number
        }[]
      }
    }
    Name: {
      title: {
        plain_text: string
      }[]
    }
    Slug: {
      rich_text: {
        text: {
          content: string
        }
      }[]
    }
    Description: {
      rich_text: {
        text: {
          content: string
        }
      }[]
    }
    Type: {
      select: {
        name: 'Photo' | 'Video'
      }
    }
    Segment: {
      select: {
        name: Category
      }
    }
    Category: {
      select: {
        name: Category
      }
    }
    Status: {
      status: {
        name: 'Plan' | 'Draft' | 'Release' | 'Archive'
      }
    }
    Project: { relation: string[]; has_more: false }
    Gallery: { checkbox: boolean }
    Featured: { number: number }
    Resolution: {
      select: {
        name: Resolution
      }
    }
    'Aspect ratio': {
      select: {
        name: AspectRatio
      }
    }
  }
}
