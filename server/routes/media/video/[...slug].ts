import { Readable } from 'node:stream'
import { z } from 'zod'

function calculateChunkRange(range: string | undefined, bufferSize: number): { chunkStart: number; chunkEnd: number; chunkSize: number } {
  let chunkStart = 0
  let chunkEnd = bufferSize - 1
  let chunkSize = bufferSize

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-')
    chunkStart = parseInt(parts[0], 10)
    chunkEnd = parts[1] ? parseInt(parts[1], 10) : bufferSize - 1
    chunkSize = chunkEnd - chunkStart + 1
  }

  return { chunkStart, chunkEnd, chunkSize }
}

function createBufferStream(buffer: Buffer, start: number, end: number) {
  return new Readable({
    read() {
      this.push(buffer.subarray(start, end + 1))
      this.push(null)
    },
  })
}

export default defineEventHandler(async (event) => {
  try {
    const storage = useStorage('fs')
    const { slug } = await getValidatedRouterParams(
      event,
      z.object({
        slug: z.string().min(1),
      }).parse
    )
    const range = getRequestHeader(event, 'range')

    const metaData = await storage.getMeta(`videos/${slug}`)
    const bufferData = await storage.getItemRaw(`videos/${slug}`)

    if (!bufferData) throw createError({ statusCode: 404, statusMessage: `video ${slug} not found` })

    const bufferSize = metaData.size as number
    const { chunkStart, chunkEnd, chunkSize } = calculateChunkRange(range, bufferSize)

    if (chunkSize !== bufferSize) setResponseStatus(event, 206)

    setResponseHeaders(event, {
      'accept-ranges': 'bytes',
      'content-type': 'video/mp4',
      'content-length': chunkSize,
      'content-range': `bytes ${chunkStart}-${chunkEnd}/${bufferSize}`,
      'cache-control': 'public, max-age=31552767',
    })

    const bufferStream = createBufferStream(bufferData, chunkStart, chunkEnd)

    return sendStream(event, bufferStream)
  } catch (error) {
    console.error('Route video GET', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
