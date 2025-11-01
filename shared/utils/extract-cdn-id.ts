export default function (url: string) {
  return url.split('/').at(-1)
}
