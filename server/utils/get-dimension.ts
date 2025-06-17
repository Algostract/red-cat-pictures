import { imageMeta } from 'image-meta'
import { execa } from 'execa'

export default async function (fileName: string, type: 'photo' | 'video') {
  const storage = useStorage('fs')
  const filePath = `${type}s/source/${fileName}`
  const buffer = await storage.getItemRaw(filePath)

  if (type === 'photo') {
    const meta = imageMeta(buffer)
    return { width: meta.width ?? 0, height: meta.height ?? 0 }
  } else if (type === 'video') {
    try {
      const { stdout } = await execa('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', `./static/${filePath}`])

      const [width, height] = stdout.trim().split(',').map(Number)
      return { width, height }
    } catch (error) {
      console.error('Error extracting video dimensions:', error)
      return { width: 0, height: 0 }
    }
  } else {
    return { width: 0, height: 0 }
  }
}
