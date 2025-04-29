export default function (markdown: string) {
  return (
    markdown
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      // Remove inline code
      .replace(/`[^`]*`/g, '')
      // Remove images
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      // Remove links but keep the text
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // Remove headings and blockquotes
      .replace(/^[>#]+\s/gm, '')
      // Remove remaining markdown symbols
      .replace(/[*_~`]/g, '')
      // Trim extra whitespace
      .trim()
  )
}
