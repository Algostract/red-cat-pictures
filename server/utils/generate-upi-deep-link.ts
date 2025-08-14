export default function (accountId: string, vpa: string, name: string, amount: number, note: string = '', currency: 'INR' = 'INR'): string {
  const linkTemplate = 'upi://pay?pa=<VPA>&pn=<NAME>&am=<AMOUNT>&tn=<NOTE>&cu=<CURRENCY>&aid=<ACCOUNTID>'
  const keys = { accountId, vpa, name, amount, note, currency }

  let finalLink = linkTemplate

  for (const key in keys) {
    if (Object.prototype.hasOwnProperty.call(keys, key)) {
      const value = keys[key as keyof typeof keys]
      finalLink = finalLink.replace(`<${key.toUpperCase()}>`, `${value}`)
    }
  }

  return encodeURI(finalLink)
}
