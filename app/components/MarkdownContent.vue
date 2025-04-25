<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{ content: string }>()

const renderer = new marked.Renderer()

renderer.link = ({ href, title, tokens }) => {
  const text = tokens.length > 0 ? tokens[0]?.raw || '' : ''

  if (title == 'embed' || text == 'embed') {
    return `<img src="${href}" alt="${text}" class="w-full aspect-video object-cover" />`
  }

  const parsedText = marked.parseInline(text, { async: false })

  return `<a href="${href}?utm_source=redcatpictures.com" target="_blank" rel="noopener"/>${title || parsedText}</a/>`
}

marked.use({ renderer })

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const hoveredLink = ref<{
  href: string
  title: string
  top: number
  left: number
} | null>(null)

watch(hoveredLink, (value) => {
  console.log('hoveredLink', value)
})
</script>

<template>
  <div>
    <div ref="containerRef" v-html="marked(props.content, { async: false })" />
    <LinkToolTip v-if="hoveredLink" :title="hoveredLink.title" :url="hoveredLink.href" :position="{ x: hoveredLink.top, y: hoveredLink.left }" />
  </div>
</template>
