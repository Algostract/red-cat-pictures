import { writeFile, readFile, unlink, mkdtemp } from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { execa } from 'execa'

export default async function (buffer: Buffer, secret: string, passphrase: string) {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'stego-'))
  const coverPath = path.join(tmpDir, 'cover.png')
  const secretPath = path.join(tmpDir, 'payload.txt')
  const outPath = path.join(tmpDir, 'stego.png')

  await writeFile(coverPath, buffer)
  await writeFile(secretPath, secret, 'utf8')

  await execa('steghide', [
    'embed',
    '-cf',
    coverPath,
    '-ef',
    secretPath,
    '-sf',
    outPath,
    '-p',
    passphrase,
    '-q', // quiet mode
  ])

  const stegoBuf = await readFile(outPath)

  await Promise.all([unlink(coverPath), unlink(secretPath), unlink(outPath)]).catch(() => {
    /* ignore errors */
  })

  return stegoBuf
}
