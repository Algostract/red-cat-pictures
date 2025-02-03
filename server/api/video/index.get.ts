const tailwindBreakpoints: Record<BreakpointKey, number> = {
  default: 0,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

function convertSources(sources: FileSources): Source[] {
  const result: Source[] = []
  // Sort the defined breakpoint keys (only those present in sources) by their numeric value.
  const sortedKeys = (Object.keys(sources) as BreakpointKey[]).sort((a, b) => tailwindBreakpoints[a] - tailwindBreakpoints[b])

  sortedKeys.forEach((bp, idx) => {
    const files = sources[bp]!
    const minWidth = tailwindBreakpoints[bp]
    const min = `(min-width: ${minWidth}px)`
    // If a higher breakpoint exists, assign a max-width.
    const nextKey = sortedKeys[idx + 1]
    const media = nextKey !== undefined ? `${min} and (max-width: ${tailwindBreakpoints[nextKey] - 0.02}px)` : min

    files.forEach((file) => {
      result.push({
        ...file,
        media,
      })
    })
  })

  return result
}

export default defineEventHandler<Promise<VideoItem[]>>(async () => {
  try {
    const videos = await readYamlFile<FileVideoItem>('videos.yml')

    if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

    return videos.map(({ sources, ..._ }) => ({ ..._, sources: convertSources(sources) }))
  } catch (error: unknown) {
    console.error('API video GET', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
