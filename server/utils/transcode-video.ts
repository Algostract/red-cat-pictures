import { execa } from 'execa'

export const codecs = ['avc', 'vp9', 'hevc', 'av1'] as const
export type Codec = (typeof codecs)[number]

export const resolutions = ['1440p', '1080p', '720p'] as const
export type Resolution = (typeof resolutions)[number]

export const orientations = ['landscape', 'portrait'] as const
export type Orientation = (typeof orientations)[number]

export const devices = ['cpu', 'gpu'] as const
export type Device = (typeof devices)[number]

const codecOptions = {
  avc: {
    extension: 'mp4',
    cpu: { lib: 'libx264', crf: 23, preset: 'slower', extra: '-threads 0', audio: 'aac' },
    gpu: { lib: 'h264_nvenc', crf: 23, preset: 'slower', audio: 'aac' },
  },
  vp9: {
    extension: 'webm',
    cpu: { lib: 'libvpx-vp9', crf: 31, deadline: 'best', extra: '-threads 0', audio: 'libvorbis' },
  },
  hevc: {
    extension: 'mp4',
    cpu: { lib: 'libx265', crf: 28, preset: 'slow', extra: '-threads 0', audio: 'aac' },
    gpu: { lib: 'h265_nvenc', crf: 28, preset: 'slow', audio: 'aac' },
  },
  av1: {
    extension: 'webm',
    cpu: { lib: 'libsvtav1', crf: 30, preset: '1', extra: '-threads 0', audio: 'libopus' },
    gpu: { lib: 'av1_nvenc', crf: 30, preset: '1', audio: 'libopus' },
  },
}

const resolutionOptions: { label: Resolution; width: number; height: number }[] = [
  { label: '1440p', width: 2560, height: 1440 },
  { label: '1080p', width: 1920, height: 1080 },
  { label: '720p', width: 1280, height: 720 },
]

interface CodecDeviceOptions {
  lib: string
  crf: number
  preset?: string
  deadline?: string
  extra?: string
  audio: string
}

function buildArgs(codecOptions: { cpu: CodecDeviceOptions; gpu?: CodecDeviceOptions }, res: { width: number; height: number }, orientation: Orientation, mode: 'cpu' | 'gpu'): string {
  let { width, height } = res
  if (orientation === 'portrait') {
    ;[width, height] = [height, width]
  }
  const scaleFilter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`
  const options = codecOptions[mode]!
  const extra = mode === 'cpu' && options.extra ? ` ${options.extra}` : ''
  return `-c:v ${options.lib} -vf "${scaleFilter}" -crf ${options.crf} -b:v 0 -${options.preset ? 'preset ' + options.preset : 'deadline ' + options.deadline} ${extra} -c:a ${options.audio}`
}

function parseArgs(args: string): string[] {
  const regex = /[^\s"]+|"([^"]*)"/gi
  const result: string[] = []
  let match: RegExpExecArray | null
  while ((match = regex.exec(args)) !== null) {
    result.push(match[1] ? match[1] : match[0])
  }
  return result
}

async function countTotalFrames(filePath: string) {
  try {
    const ffmpegProcess = await execa('ffmpeg', ['-i', filePath, '-map', '0:v:0', '-f', 'null', '-'], {
      stderr: 'pipe',
    })

    const progressLog = ffmpegProcess.stderr.toString()

    const matches = [...progressLog.matchAll(/frame=\s*(\d+)/g)]
    if (matches.length === 0) {
      return 0
    }
    const lastFrameCount = parseInt(matches[matches.length - 1][1], 10)
    return lastFrameCount
  } catch {
    throw Error('Unable to countTotalFrames ' + filePath)
  }
}

export default async function (
  fileName: string,
  resolution: Resolution,
  orientation: Orientation,
  codec: Codec,
  device: Device = 'cpu',
  onUpdate?: (args: { fileName: string; status: string; completion: number; eta: number; fps: number }) => void
) {
  const codecOption = codecOptions[codec]
  if (!codecOption) throw new Error(`Codec ${codec} not supported`)

  const resolutionOption = resolutionOptions.find((r) => r.label === resolution)
  if (!resolutionOption) throw new Error(`Resolution ${resolution} not defined`)

  const presetName = `${codec}-${resolution}-${orientation}`
  const selectedArgs =
    device === 'gpu'
      ? 'gpu' in codecOption && codecOption.gpu
        ? buildArgs(codecOption, resolutionOption, orientation, 'gpu')
        : (() => {
            throw new Error(`GPU not supported for codec ${codec}`)
          })()
      : buildArgs(codecOption, resolutionOption, orientation, 'cpu')
  const extension = codecOption.extension

  try {
    console.log(`Conversion started ${fileName} to ${presetName}`)
    if (onUpdate)
      onUpdate({
        fileName,
        status: `start-${presetName}`,
        completion: 0,
        eta: Infinity,
        fps: 0,
      })

    const totalFrames = await countTotalFrames(`./static/videos/source/${fileName}`)
    const progressData: Record<string, string> = {}

    const ffmpegProcess = execa(
      'ffmpeg',
      ['-y', '-i', `./static/videos/source/${fileName}`, ...parseArgs(selectedArgs), `./static/videos/${fileName.split('.')[0]}-${presetName.toLowerCase()}.${extension}`, '-progress', 'pipe:1'],
      { stdout: 'pipe', stderr: 'pipe' }
    )

    ffmpegProcess.stdout.on('data', (chunk) => {
      chunk
        .toString()
        .split('\n')
        .forEach((line: string) => {
          const [key, value] = line.split('=')
          if (key && value) progressData[key.trim()] = value.trim()
        })
    })

    const progressInterval = setInterval(() => {
      if (progressData.out_time_ms) {
        const processedFrames = parseInt(progressData.frame, 10)
        const fps = parseFloat(progressData.fps)
        if (Number.isNaN(processedFrames) || Number.isNaN(fps)) return
        const completion = Number(((processedFrames / totalFrames) * 100).toFixed(2))
        const eta = Number(((totalFrames - processedFrames) / fps).toFixed(2))
        if (onUpdate)
          onUpdate({
            fileName,
            status: `process-${presetName}`,
            completion,
            eta,
            fps,
          })
      }
    }, 1000)

    await ffmpegProcess
    clearInterval(progressInterval)

    console.log(`Conversion complete ${fileName} to ${presetName}`)
    if (onUpdate)
      onUpdate({
        fileName,
        status: `complete-${presetName}`,
        completion: 100,
        eta: 0,
        fps: 0,
      })

    return { status: 'fulfilled', value: presetName }
  } catch (error) {
    console.error('transcode-video ', error)
    return {
      status: 'rejected',
      value: presetName,
      reason: error instanceof Error ? error.message : String(error),
    }
  }
}
