const resolutions = ['4320p', '2160p', '1440p', '1080p', '720p', '480p'] as const
type Resolution = (typeof resolutions)[number]

/**
 * Determine the nearest resolution bucket based on the IMAGE HEIGHT (vertical "p").
 */
export default function (width: number, height: number): Resolution {
  const buckets = resolutions.map((r) => Number(r.slice(0, -1)))

  for (const b of buckets) {
    if (height >= b) {
      return `${b}p` as Resolution
    }
  }

  return resolutions[resolutions.length - 1]
}
