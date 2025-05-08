import outreachTemplate from './OutreachTemplate.vue'

export interface OutreachEmail {
  fromCompanyName: string
  fromPersonName: string
  fromEmail: string
  fromCompanyLogo: string
  fromCompanyLink: string
  fromCompanyPhone: string
  fromFeaturedPhotos: string[]
  emailSubject: string
  toCompanyName: string
  toPersonName: string
  toEmail: string
}

const cachedReadYamlFile = defineCachedFunction(readYamlFile)

export default {
  outreach: {
    template: outreachTemplate,
    data: async (data: Pick<OutreachEmail, 'toCompanyName' | 'toPersonName' | 'toEmail'>): Promise<OutreachEmail> => {
      const outreachData = ((await cachedReadYamlFile<{ outreach: string }>('emails.yml')) as unknown as { outreach: string }).outreach as unknown as Omit<
        OutreachEmail,
        'toCompanyName' | 'toPersonName' | 'toEmail'
      >
      return { ...outreachData, ...data }
    },
  },
}
