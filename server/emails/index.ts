import type { Component } from 'vue'
import { parseYAML } from 'confbox'
import contentTemplate from './ContentTemplate.vue'
import prospectTemplate from './ProspectTemplate.vue'

export interface ContentEmail {
  fromCompanyName: string
  fromEmail: string
  fromCompanyLogo: string
  fromCompanyLink: string
  emailSubject: string
  contentTitle: string
  contentImage: string
  contentUrl: string
  unsubscribeUrl: string
  toPersonName: string
  toEmail: string
}

export interface ProspectEmail {
  fromCompanyName: string
  fromPersonName: string
  fromEmail: string
  fromCompanyLogo: string
  fromCompanyLink: string
  fromCompanyPhone: string
  fromFeaturedPhotos: { id: string; title: string; description: string }[]
  emailSubject: string
  toCompanyName: string
  toPersonName: string
  toEmail: string
}

/**
 * Generic function to read and parse YAML by key
 */
async function loadYamlSection<T>(filename: string, section: string): Promise<T> {
  const storage = useStorage('fs')
  const fileContents = await storage.getItem(`data/${filename}`)
  if (!fileContents) {
    throw new Error(`Missing YAML file: ${filename}`)
  }
  const parsed = parseYAML<{ [key: string]: unknown }>(fileContents.toString())
  if (!(section in parsed)) {
    throw new Error(`Section ${section} not found in ${filename}`)
  }
  return parsed[section] as T
}

/**
 * Factory to create email modules with DRY logic
 */
function createEmailModule<TData extends Record<string, unknown>, TMeta extends Record<string, unknown>, TEMeta = TMeta>(
  section: string,
  template: Component,
  enrich?: (meta: TMeta) => Promise<Partial<TEMeta>>
) {
  return {
    template,
    data: async (data: TData, metaData?: Omit<TMeta, keyof TData>): Promise<TEMeta & TData> => {
      const baseMeta = (metaData as TMeta) ?? (await loadYamlSection<{ [K in keyof TMeta]: TMeta[K] }>('emails.yml', section))
      const extra = enrich ? await enrich(baseMeta) : {}
      return { ...(baseMeta as object), ...extra, ...data } as TEMeta & TData
    },
  }
}

export type EmailTemplateData = {
  content: Pick<ContentEmail, 'toPersonName' | 'toEmail'>
  prospect: Pick<ProspectEmail, 'toCompanyName' | 'toPersonName' | 'toEmail'>
}

const emailTemplate = {
  content: createEmailModule<Pick<ContentEmail, 'toPersonName' | 'toEmail'>, Omit<ContentEmail, 'toPersonName' | 'toEmail'>>('content', contentTemplate),
  prospect: createEmailModule<
    Pick<ProspectEmail, 'toCompanyName' | 'toPersonName' | 'toEmail'>,
    Omit<ProspectEmail, 'toCompanyName' | 'toPersonName' | 'toEmail' | 'fromFeaturedPhotos'> & { fromFeaturedPhotos: string[] },
    Omit<ProspectEmail, 'toCompanyName' | 'toPersonName' | 'toEmail'>
  >('prospect', prospectTemplate, async (meta) => {
    const fromFeaturedPhotos = await Promise.all(
      meta.fromFeaturedPhotos.map(async (key) => {
        try {
          const data = await $fetch(`/api/photo/${(key as unknown as string).toLowerCase()}`, {
            baseURL: meta.fromCompanyLink,
          })
          if (Array.isArray(data)) throw new Error('Unexpected array response')
          return { id: data.id, title: data.title, description: data.description }
        } catch {
          return null
        }
      })
    ).then((photos) => photos.filter((photo) => photo !== null))

    return {
      fromFeaturedPhotos,
    }
  }),
}

export default emailTemplate
