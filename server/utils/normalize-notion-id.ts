import { createRegExp, charIn, global } from 'magic-regexp'

export default function (id: string): string {
  return id.replace(createRegExp(charIn('-'), [global]), '')
}
