import { z } from 'zod'
import { initAI } from '@shba007/unai'
import { scrapeData } from '~~/server/tasks/sync/meta-data'

const ai = initAI()

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function changeCaseSentence(str: string) {
  if (!str) return '' // Handle empty or falsy input
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() // Uppercase first char + remainder
}

function normalizeEmptyToNull(obj: object) {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value === '' ? null : value]))
}

const companyInfoSchema = z.object({
  name: z.string(), // always present
  type: z.enum(['Agency', 'Brand']),
  website: z.string(), // must be a valid URL
  instagram: z.string(), // URL or null
  linkedIn: z.string(), // URL or null
  email: z.string(), // email format or null
  whatsapp: z.string(), // WhatsApp link (e.g. https://wa.me/...) or null
  phone: z.string(), // free-form phone (E.164 preferred) or null
})

export type CompanyInfo = typeof companyInfoSchema

export default defineTask({
  meta: {
    name: 'prospect:fetch',
    description: 'Scrapes Prospect Info',
  },
  async run({ payload }) {
    const urls = payload.urls as unknown as string[]

    if (!(urls && urls.length > 0)) throw Error('urls are not defined')

    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    const result = []

    for (const url of urls) {
      try {
        const markdown = await scrapeData(url, 'markdown', 'browser')

        if (!markdown) throw Error('Markdown Empty')

        // Craft the prompt
        const prompt = `
          Extract the following details for the company url: "${url}":
          - name: full legal or common name
          - type: Agency or Brand
          - website: primary domain (include https://)
          - instagram: full Instagram profile URL
          - linkedIn: full LinkedIn page URL
          - email: public contact email
          - whatsapp: WhatsApp link (https://wa.me/...) (NO SPACES, NO PlUS)
          - phone: main contact number in international format (NO SPACES, ALWAYS PlUS) (if missing use whatsapp number)
          if a field is missing give empty string
  
          Here is the websites markdown:
          ${markdown}
      
          Output strictly valid JSON conforming to the schema.`

        const response = await ai.run<z.infer<CompanyInfo>>('text-generate', '@OpenAI/o4-mini:latest', {
          prompt: prompt,
          stream: false,
          format: companyInfoSchema,
        })

        if (response.content instanceof ReadableStream) throw Error('Readable Stream')

        const data = normalizeEmptyToNull(response.content)
        await notion.pages.create({
          parent: {
            database_id: notionDbId.prospect,
          },
          properties: {
            Name: {
              type: 'title',
              title: [
                {
                  type: 'text',
                  text: {
                    content: data.name,
                  },
                },
              ],
            },
            Status: {
              type: 'status',
              status: {
                name: 'Unverified',
              },
            },
            Type: {
              type: 'select',
              select: {
                name: changeCaseSentence(data.type),
              },
            },
            Website: {
              type: 'url',
              url: data.website,
            },
            Instagram: {
              type: 'url',
              url: data.instagram,
            },
            LinkedIn: {
              type: 'url',
              url: data.linkedIn,
            },
            Email: {
              type: 'email',
              email: data.email,
            },
            Whatsapp: {
              type: 'url',
              url: data.whatsapp,
            },
            Phone: {
              type: 'phone_number',
              phone_number: data.phone,
            },
          },
        })

        result.push(data)
      } catch (error) {
        console.warn(`Issue in url ${url} \n`, error)
      }

      await delay(60 * 1000)
    }

    return { result: result }
  },
})
