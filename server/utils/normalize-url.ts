export default function (url: string): string {
  const [base] = url.split(/[?#]/, 1)
  return base.replaceAll('/', '_').replaceAll(':', '_')
}
