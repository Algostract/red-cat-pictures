import { writeFile, readFile, unlink, mkdtemp } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { execa } from 'execa'

export default async function (buffer: Buffer, passphrase: string): Promise<string | undefined> {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'stego-'))
  const stegoPath = path.join(tmpDir, 'stego.png')
  const outPath = path.join(tmpDir, 'extracted.txt')

  try {
    await writeFile(stegoPath, buffer)
    await execa('steghide', ['extract', '-sf', stegoPath, '-xf', outPath, '-p', passphrase, '-q'])
    const message = await readFile(outPath, 'utf8')
    return message
  } catch {
    return undefined
  } finally {
    await Promise.all([unlink(stegoPath).catch(() => {}), unlink(outPath).catch(() => {})])
  }
}
