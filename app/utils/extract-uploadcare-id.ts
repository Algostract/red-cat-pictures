export default function (url: string | undefined): string | undefined {
  return url?.match(/^https:\/\/ucarecdn\.com\/([^/]+)(?:\/|$)/)?.[1]
}
