import { execa } from 'execa'

/**
 * Generates thumbnails from a video using ffmpeg via execa.
 * @param filePath Path to the input video file.
 * @param outputPath Output filename or pattern. For multiple thumbnails, include printf-style specifier (e.g., 'thumb_%03d.jpg').
 * @param options ThumbnailOptions controlling mode, timestamps, intervals, scaling, and quality.
 */
export default async function (filePath: string, outputPath: string, timestamp: string, quality?: number) {
  quality = quality ?? 2
  const fileName = filePath.split('/').at(-1)!
  const outputFilePath = `${outputPath}/${fileName.split('.')[0]}.jpg`

  await execa('ffmpeg', ['-y', '-ss', timestamp, '-i', filePath, '-frames:v', '1', '-q:v', quality.toString(), '-update', '1', outputFilePath])
}
