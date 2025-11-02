import { consola } from 'consola'

export const messageTemplates = {
  greet: `We are RED CAT PICTURES a premium product photography and videography company
  \nHow can we help you?
  \nwebsite: https://redcatpictures.com`,
  prospectStart: `Hello {{companyName}} Team,
  \nI’m Aratrik Nandy from RED CAT PICTURES. We specialize in product videography and photography—delivering crisp, high‑resolution photos and short‑form videos
  for e‑commerce, social media, and advertising. Whether on‑location or in‑studio, our full production and post‑production services ensure top‑quality assets, on time and within budget. Here are some of our work
  \nWebsite: https://redcatpictures.com?ref=whatsapp`,
  prospectMiddle: [
    'ecommerce-photo-020-001',
    'product-photo-000-025',
    'ecommerce-photo-000-007',
    'product-photo-022-004',
    'food-photo-000-016',
    'food-photo-010-004',
    'food-photo-000-020',
    'food-photo-011-003',
  ],
  prospectEnd: `I would appreciate a brief call to discuss strategies for enhancing your clients' visual marketing campaigns. Please advise on your availability.
  \nThank you for your consideration.`,
}

export default defineNitroPlugin(async () => {
  const {
    public: { cdnUrl },
  } = useRuntimeConfig()
  // eslint-disable-next-line no-constant-condition
  if (!(import.meta.env.NODE_ENV === 'production' && import.meta.env.PLATFORM_ENV !== 'native' && false)) return

  consola.info('Whatsapp Bot Initializing...')

  whatsapp.on('authenticated', () => {
    consola.success('Session restored successfully.')
  })
  whatsapp.on('auth_failure', (msg) => {
    consola.warn('Authentication failed:', msg)
  })
  whatsapp.on('disconnected', (reason) => {
    consola.warn('Client disconnected:', reason)
  })
  whatsapp.on('qr', (data) => consola.log(renderANSI(data, { border: 1 })))
  whatsapp.on('ready', () => consola.success('WhatsApp bot is live'))
  // Listening to all Incoming Admin Commends
  whatsapp.on('message', async (message) => {
    try {
      // consola.log('message.from', message.from)
      if (message.from !== '') return

      switch (message.body.toLowerCase().trim()) {
        case 'health':
          await message.reply('Status OK')
          break

        default:
          break
      }
    } catch (error) {
      consola.warn('Error in message', error)
    }
  })
  // Listening to all Outgoing Commends
  whatsapp.on('message_create', async (message) => {
    // consola.log('message.to', message.to)
    try {
      switch (message.body.toLowerCase().trim()) {
        case 'hi':
        case 'hey':
        case 'hello':
          await whatsapp.sendMessage(message.to, messageTemplates.greet)
          break
        case 'our ecommerce photos':
        case 'our product photos':
        case 'our food photos': {
          const links: string[] = (await $fetch('/api/photo'))
            .filter((item) => item.category === (message.body.toLowerCase().trim().split(' ').at(1) as unknown as Category))
            .map((item) => {
              return `${cdnUrl}/image/f_jpeg&s_${Math.min(1080, Math.round(1080 * item.aspectRatio))}x${Math.min(1080, Math.round(1080 / item.aspectRatio))}/${item.image}`
            })

          await Promise.allSettled(
            links.map(async (link) => {
              const media = await WAWebJS.MessageMedia.fromUrl(link, { unsafeMime: true })
              await whatsapp.sendMessage(message.to, media)
            })
          )
          break
        }

        default:
          break
      }
    } catch (error) {
      consola.warn('Error in message_create', error)
    }
  })

  await whatsapp.initialize()
  consola.info('WhatsApp bot setup completed...')
})
