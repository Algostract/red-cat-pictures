export default defineEventHandler(() => {
  const config = useRuntimeConfig()

  const payment = config.private.paymentUpiInfo as unknown as {
    accountName: string
    accountId: string
    vpa: string
  }

  const title = 'Project'
  const upiLink = generateUpiDeepLink(payment.accountId, payment.vpa, payment.accountName, 300, title)

  return { upiIntent: upiLink }
})
