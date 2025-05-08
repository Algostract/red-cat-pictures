import { sendEmail } from '~~/server/api/notification/email.post'

export default defineTask({
  meta: {
    name: 'outreach',
    description: 'Outreach agencies via email, instagram, whatsApp',
  },
  async run() {
    const prospectStorage = useStorage<Resource<'prospect'>>(`data:resource:prospect`)

    await Promise.allSettled(
      (await prospectStorage.getItems(await prospectStorage.getKeys())).map(async ({ value: prospect }) => {
        const id = prospect.record.id
        const companyName = prospect.record.properties.Name.title.map(({ plain_text }) => plain_text ?? '').join('')
        const email = prospect.record.properties.Email.email

        if (!email || prospect.notificationStatus == true) return

        console.log({ companyName, email })
        await sendEmail('outreach', {
          toEmail: email,
          toCompanyName: companyName,
          toPersonName: companyName,
        })

        prospect.notificationStatus = true
        await prospectStorage.setItem(normalizeNotionId(id), prospect)
      })
    )

    return { result: 'success' }
  },
})
