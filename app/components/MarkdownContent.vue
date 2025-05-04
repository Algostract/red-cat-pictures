<script setup lang="ts">
import { marked } from 'marked'

const props = defineProps<{ content: string }>()

const renderer = new marked.Renderer()

renderer.link = ({ href, title, tokens }) => {
  const text = tokens.length > 0 ? tokens[0]?.raw || '' : ''

  if (title == 'embed' || text == 'embed') {
    return `<img src="${href}" alt="${text}" class="w-full aspect-video object-cover" />`
  } else if (title == 'video' || text == 'video') {
    const videoId = href.split('/').pop()
    return `<iframe src="https://www.youtube.com/embed/${videoId}?si=lG674PPCuncqyX85&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
  }

  const parsedText = marked.parseInline(text, { async: false })

  return `<a href="${href}?utm_source=redcatpictures.com" target="_blank" rel="noopener">${parsedText}</a>`
}

marked.use({ renderer })

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const hoveredLink = ref<{
  url: string
  title: string
  position: { x: number; y: number }
}>()

function showTooltip(event: TouchEvent | MouseEvent | FocusEvent) {
  const target = (event.target as HTMLElement).closest('a') as HTMLAnchorElement | null
  if (target && containerRef.value) {
    const linkRect = target.getBoundingClientRect()
    const containerRect = containerRef.value.getBoundingClientRect()

    stop()
    hoveredLink.value =
      hoveredLink.value && hoveredLink.value.url === target.href
        ? hoveredLink.value
        : {
            url: target.href,
            title: target.title || target.textContent || '',
            position: {
              x: Math.round(linkRect.left - containerRect.left + linkRect.width / 2),
              y: Math.round(linkRect.top - containerRect.top + linkRect.height),
            },
          }
  }
}

const { start, stop } = useTimeoutFn(
  () => {
    hoveredLink.value = undefined
  },
  100,
  { immediate: false }
)

function hideTooltip(event: TouchEvent | MouseEvent | FocusEvent) {
  const target = (event.target as HTMLElement).closest('a') as HTMLAnchorElement | null
  if (!target) {
    start()
  }
}
</script>

<template>
  <div class="relative">
    <div
      ref="containerRef"
      class="content relative"
      @touchstart.capture="showTooltip"
      @touchend.capture="hideTooltip"
      @touchcancel.capture="hideTooltip"
      @focusin.capture="showTooltip"
      @focusout.capture="hideTooltip"
      @mouseover.capture="showTooltip"
      @mouseleave.capture="hideTooltip"
      v-html="marked(props.content, { async: false })" />
    <LazyLinkToolTip
      :active-link="hoveredLink"
      hydrate-on-idle
      @touchstart.self="showTooltip"
      @touchend.self="hideTooltip"
      @touchcancel.self="hideTooltip"
      @focusin.self="showTooltip"
      @focusout.self="hideTooltip"
      @mouseenter.self="showTooltip"
      @mouseleave.self="hideTooltip" />
  </div>
</template>

<style>
.content h1 {
  @apply my-4 text-xl font-semi-bold md:text-3xl;
}

.content h2 {
  @apply my-3 text-lg font-semi-bold md:text-2xl;
}

.content h3 {
  @apply my-2 text-base font-semi-bold text-alert-600 md:text-xl;
}

.content h4 {
  @apply my-1 text-sm font-semi-bold md:text-lg;
}

.content p {
  @apply my-2 font-light md:my-4 md:text-[1.125rem];
}

.content > img {
  @apply mx-auto my-4 aspect-video max-h-[18rem] w-full rounded-md object-cover md:my-8;
}

.content aside {
  @apply my-2 flex items-start gap-1 rounded bg-dark-600/20 p-4;
}

.content aside > img {
  @apply w-7;
}

.content aside > p {
  @apply my-0;
}

.content strong {
  @apply font-semi-bold;
}

.content ol {
  @apply ml-8 list-decimal;
}

.content ul {
  @apply ml-8 list-disc;
}

.content a {
  @apply whitespace-nowrap underline underline-offset-1;
}

.content h3 > a {
  @apply no-underline;
}

.content blockquote {
  @apply rounded border-l-4 border-primary-500 pl-4;
}

.content iframe {
  @apply relative block aspect-video w-full;
}
</style>
