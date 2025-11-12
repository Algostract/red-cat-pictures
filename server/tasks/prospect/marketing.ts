import { hash } from 'ohash'
import { sendWhatsappMessage } from '~~/server/api/notification/whatsapp/[id]/send.post'
import { messageTemplates } from '~~/server/plugins/whatsapp'

// brand.util.ts
export type BrandType = 'Agency' | 'Food' | 'FMCG' | 'Sweet' | 'Real Estate' | 'Hotel' | 'Home Decor' | 'Product' | 'Leather' | 'Garment' | 'Cosmetics' | 'Jewellery' | 'Accessories' | 'Luxury'

type FlagKey =
  | 'isAgency'
  | 'isFood'
  | 'isFMCG'
  | 'isSweet'
  | 'isRealEstate'
  | 'isHotel'
  | 'isHomeDecor'
  | 'isProduct'
  | 'isLeather'
  | 'isGarment'
  | 'isCosmetics'
  | 'isJewellery'
  | 'isAccessories'
  | 'isLuxury'

const BASE_FLAGS: Record<FlagKey, boolean> = {
  isAgency: false,
  isFood: false,
  isFMCG: false,
  isSweet: false,
  isRealEstate: false,
  isHotel: false,
  isHomeDecor: false,
  isProduct: false,
  isLeather: false,
  isGarment: false,
  isCosmetics: false,
  isJewellery: false,
  isAccessories: false,
  isLuxury: false,
} as const

const BRAND_RULES: Record<BrandType, FlagKey[]> = {
  Agency: ['isAgency'],
  Food: ['isFood'],
  FMCG: ['isFMCG'],
  Sweet: ['isSweet', 'isFood'],
  'Real Estate': ['isRealEstate'],
  Hotel: ['isHotel', 'isLuxury'],
  'Home Decor': ['isHomeDecor'],
  Product: ['isProduct'],
  Leather: ['isLeather'],
  Garment: ['isGarment'],
  Cosmetics: ['isCosmetics'],
  Jewellery: ['isJewellery', 'isLuxury'],
  Accessories: ['isAccessories'],
  Luxury: ['isLuxury'],
} as const

export function getBrandType(type: BrandType) {
  const flags = { ...BASE_FLAGS }
  for (const key of BRAND_RULES[type]) flags[key] = true
  return { name: type, ...flags } as const
}

export default defineTask({
  meta: {
    name: 'prospect:marketing',
    description: 'Outreach agencies via email, instagram, whatsApp',
  },
  async run() {
    const config = useRuntimeConfig()
    const prospectStorage = useStorage<Resource<'prospect'>>(`data:resource:prospect`)
    const emailStorage = useStorage<EmailSubscription>('data:subscription:email')
    const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')

    await Promise.allSettled(
      (await prospectStorage.getItems(await prospectStorage.getKeys())).map(async ({ value: prospect }) => {
        const prospectId = prospect.record.id
        const companyName = notionTextStringify(prospect.record.properties.Name.title)
        const companyType = prospect.record.properties.Type.select.name as BrandType
        const email = prospect.record.properties.Email.email
        const whatsapp = prospect.record.properties.Whatsapp.url?.replace(/^https?:\/\/wa\.me\//, '')
        const status = prospect.record.properties.Status.status.name

        if (!(status === 'Verified')) return

        if (email) {
          console.log(`Sending new marketing email →`, companyName)

          // Send Email
          try {
            await $fetch('/events/trigger', {
              baseURL: config.private.novuApi,
              method: 'POST',
              headers: {
                Authorization: `ApiKey ${config.private.novuApiKey}`,
              },
              body: {
                name: 'outreach-prospect-client',
                to: {
                  subscriberId: hash({ email }),
                  email: email,
                  firstName: companyName,
                },
                payload: {
                  brandType: getBrandType(companyType),
                },
              },
            })
          } catch (error) {
            console.error(error)
          }

          // Subscribe to Email Notification
          await emailStorage.setItem(email, {
            name: companyName,
            email,
          })
        }

        if (whatsapp) {
          console.log(`Sending new marketing whatsapp →`, companyName)

          await sendWhatsappMessage([
            {
              to: whatsapp,
              data: {
                asset: '',
                text: messageTemplates.prospectStart,
              },
            },
          ])
          await Promise.allSettled(
            messageTemplates.prospectMiddle.map(async (key) => {
              try {
                const data = await $fetch(`/api/photo/${(key as unknown as string).toLowerCase()}`)
                if (Array.isArray(data)) throw new Error('Unexpected array response')

                const link = `${config.public.cdnUrl}/image/f_jpeg&s_${Math.min(1080, Math.round(1080 * data.aspectRatio))}x${Math.min(1080, Math.round(1080 / data.aspectRatio))}/${extractCdnId(data.image)}`

                await sendWhatsappMessage([
                  {
                    to: whatsapp,
                    data: {
                      asset: link,
                      text: ``,
                    },
                  },
                ])
              } catch {
                return null
              }
            })
          )
          await sendWhatsappMessage([
            {
              to: whatsapp,
              data: {
                asset: '',
                text: messageTemplates.prospectEnd,
              },
            },
          ])

          // Subscribe to Whatsapp Notification
          await whatsappStorage.setItem(whatsapp, {
            name: companyName,
            phone: whatsapp,
          })
        }

        await notion.pages.update({
          page_id: prospectId,
          properties: {
            Status: {
              status: {
                name: 'Initiate',
              },
            },
          },
        })

        prospect.record.properties.Status.status.name = 'Initiate'
        await prospectStorage.setItem(normalizeNotionId(prospectId), prospect)
      })
    )

    return { result: 'success' }
  },
})
