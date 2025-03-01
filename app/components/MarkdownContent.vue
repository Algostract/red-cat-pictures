<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{ content: string }>()

const renderer = new marked.Renderer()

renderer.link = ({ href, title, tokens }) => {
  const text = tokens.length > 0 ? tokens[0]?.raw || '' : ''

  if (title == 'embed' || text == 'embed') {
    return `<img src="${href}" alt="${text}" class="w-full aspect-video object-cover" />`
  }

  const parsedText = marked.parseInline(text)

  return `<a href="${href}" target="_blank" rel="noopener"/>${title || parsedText}</a/>`
}

marked.setOptions({ renderer })

const htmlContent = computedAsync(async () => await marked(props.content))

const containerRef = ref<HTMLElement | null>(null)
const hoveredLink = ref<{
  href: string
  title: string
  top: number
  left: number
} | null>(null)

// TODO: complete
/* useEventListener(containerRef, 'mouseover', (e: MouseEvent)=> {
  const target = e.target as HTMLElement
  const link = target.closest('a')  // Get the closest <a> element

  if (link) {
    console.log("Mouse Over")
    const rect = link.getBoundingClientRect()
    hoveredLink.value = {
      href: link.getAttribute('href') || '',
      title: link.getAttribute('title') || link.textContent || '',
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    }
  }
})
useEventListener(containerRef, 'mouseout', (e: MouseEvent) =>{
  const target = e.target as HTMLElement
  const link = target.closest('a')
  if (!link) return

  // e.relatedTarget is the element that the mouse is entering
  const related = e.relatedTarget as HTMLElement
  if (!related || !link.contains(related)) {
    hoveredLink.value = null
  }
}) */
</script>

<template>
  <div ref="containerRef" v-html="htmlContent" />
  <LinkToolTip v-if="hoveredLink" :title="hoveredLink.title" :url="hoveredLink.href"
    :position="{ x: hoveredLink.top, y: hoveredLink.left }" />
</template>
