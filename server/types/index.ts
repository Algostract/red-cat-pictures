export type NotionDB = { client: string; project: string; content: string; model: string; studio: string }

export interface NotionProjectClient {
  id: string
  created_time: Date
  last_edited_time: Date
  cover: null
  icon:
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
  cover: null
  icon:
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
        name: 'Plan' | 'Draft' | 'Ready' | 'Publish' | 'Unpublish'
      }
    }
    'Content type': {
      select: {
        name: 'Episode' | 'Blog'
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
