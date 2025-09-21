import prospectTemplate from './ProspectTemplate.vue'
import contentTemplate from './ContentTemplate.vue'

export interface EmailMetaData {
  fromCompanyName: string
  fromCompanyLogo: string
  fromCompanyLink: string
  fromCompanyPhone: string
  fromEmail: string
}

export interface ContentEmail {
  contentTitle: string
  contentImage: string
  contentUrl: string
  unsubscribeUrl: string
  toPersonName: string
  toEmail: string
}

export interface ProspectEmail {
  toCompanyName: string
  toPersonName: string
  toEmail: string
}

export type EmailTemplateData = {
  prospect: ProspectEmail
  content: ContentEmail
}

const emailTemplate = {
  prospect: {
    template: prospectTemplate,
    data: {
      emailSubject: 'Elevate Your Brand’s Visuals: Product Photography/Videography from RED CAT PICTURES',
    },
  },
  content: {
    template: contentTemplate,
    data: {},
  },
}

export default emailTemplate
