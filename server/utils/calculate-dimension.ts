export default function (resolution: number, aspectRatio: number): { width: number; height: number } {
  const height = resolution
  const width = Math.round(resolution * aspectRatio)

  return { width, height }
}
