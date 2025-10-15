import { Readable } from 'node:stream'
import { z } from 'zod'

function toNodeBuffer(raw: unknown): Buffer {
  // NEW
  if (Buffer.isBuffer(raw)) return raw as Buffer
  if (raw instanceof ArrayBuffer) return Buffer.from(raw)
  if (ArrayBuffer.isView(raw)) {
    const v = raw as ArrayBufferView
    return Buffer.from(v.buffer, v.byteOffset, v.byteLength)
  }
  throw new Error('Unsupported binary type from storage')
}

function calculateChunkRange(range: string | undefined, bufferSize: number): { chunkStart: number; chunkEnd: number; chunkSize: number } {
  let chunkStart = 0
  let chunkEnd = bufferSize - 1
  let chunkSize = bufferSize

  if (range) {
    const m = range.match(/bytes=(\d*)-(\d*)/)
    if (m) {
      const startStr = m[1]
      const endStr = m[2]
      if (startStr === '' && endStr === '') {
        // invalid range; let caller handle 416 // NEW
      } else if (startStr !== '' && endStr === '') {
        chunkStart = Math.min(parseInt(startStr, 10), Math.max(0, bufferSize - 1))
        chunkEnd = bufferSize - 1 // CHANGED
      } else if (startStr === '' && endStr !== '') {
        const suffix = Math.min(parseInt(endStr, 10), bufferSize)
        chunkStart = Math.max(bufferSize - suffix, 0)
        chunkEnd = bufferSize - 1
      } else {
        chunkStart = parseInt(startStr, 10)
        chunkEnd = parseInt(endStr, 10)
        if (chunkStart > chunkEnd) {
          // invalid range, let caller decide 416 // NEW
        }
        chunkStart = Math.min(Math.max(0, chunkStart), Math.max(0, bufferSize - 1))
        chunkEnd = Math.min(Math.max(0, chunkEnd), Math.max(0, bufferSize - 1))
      }
      chunkSize = chunkEnd - chunkStart + 1
    }
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
    const storage = useStorage('r2')
    const { slug } = await getValidatedRouterParams(event, z.object({ slug: z.string().min(1) }).parse)
    const range = getRequestHeader(event, 'range')

    const metaData = await storage.getMeta(`videos/${slug}`)
    const raw = await storage.getItemRaw(`videos/${slug}`)

    if (!raw) throw createError({ statusCode: 404, statusMessage: `video ${slug} not found` })

    const buffer = toNodeBuffer(raw)

    const bufferSize = typeof metaData?.size === 'number' ? metaData.size : buffer.byteLength

    const { chunkStart, chunkEnd, chunkSize } = calculateChunkRange(range, bufferSize)
    if (range) {
      if (chunkStart < 0 || chunkEnd < 0 || chunkStart >= bufferSize || chunkEnd >= bufferSize || chunkStart > chunkEnd) {
        setResponseStatus(event, 416)
        setResponseHeaders(event, {
          'content-range': `bytes */${bufferSize}`,
        })
        return ''
      }
    }

    if (range) setResponseStatus(event, 206)

    setResponseHeaders(event, {
      'accept-ranges': 'bytes',
      'content-type': 'video/mp4',
      'content-length': chunkSize,
      ...(range ? { 'content-range': `bytes ${chunkStart}-${chunkEnd}/${String(bufferSize)}` } : {}),
      'cache-control': 'public, max-age=31536000, immutable',
    })

    const bufferStream = createBufferStream(buffer, chunkStart, chunkEnd)
    return sendStream(event, bufferStream)
  } catch (error) {
    console.error('Route video GET', error)
    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }
    throw createError({ statusCode: 500, statusMessage: 'Some Unknown Error Found' })
  }
})
