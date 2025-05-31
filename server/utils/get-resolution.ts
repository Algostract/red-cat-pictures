const resolutions = ['7680p', '3840p', '2560p', '1440p', '1080p', '720p'] as const
type Resolution = (typeof resolutions)[number]

/**
 * Determine the nearest resolution bucket based on the larger image dimension.
 */
export default function (width: number, height: number): Resolution {
  const maxDim = Math.max(width, height)
  return resolutions.find((r) => maxDim >= Number(r.slice(0, -1))) || resolutions[resolutions.length - 1]
}
