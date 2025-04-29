export default async function (str: string, regex: RegExp, replacer: (match: RegExpMatchArray) => Promise<string>): Promise<string> {
  let result = ''
  let lastIndex = 0
  let match
  // loop through matches
  while ((match = regex.exec(str)) !== null) {
    // append text up to match
    result += str.slice(lastIndex, match.index)
    // append async replacement
    result += await replacer(match)
    lastIndex = regex.lastIndex
  }
  // append remainder
  result += str.slice(lastIndex)
  return result
}
