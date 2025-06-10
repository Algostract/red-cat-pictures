import { createIPX, ipxFSStorage } from 'ipx'

export const ipx = createIPX({
  storage: ipxFSStorage({ dir: './' }),
})

export default async function (filePath: string, width: number, height: number) {
  const fileName = filePath.split('/').at(-1)!

  const processor = ipx(filePath, {
    width: `${width}`,
    height: `${height}`,
    fit: 'cover',
    format: 'webp',
  })

  const result = await processor.process()

  const blob = new Blob([result.data], { type: 'image/webp' })
  return new File([blob], fileName.split('.')[0] + '.webp', { type: 'image/webp' })
}
