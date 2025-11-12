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

export type EmailTemplateData = {
  content: ContentEmail
}

const emailTemplate = {
  content: {
    template: contentTemplate,
    data: {},
  },
}

export default emailTemplate
