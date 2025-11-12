export default function (url?: string) {
  return url ? url.split('/').at(-1) : ''
}
