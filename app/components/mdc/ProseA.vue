<script setup lang="ts">
defineProps<{ href: string; title?: string }>()
const attrs = useAttrs()

const hoveredLink = ref<{
  url: string
  title: string
}>()

function showTooltip(event: TouchEvent | MouseEvent | FocusEvent) {
  const target = (event.target as HTMLElement).closest('a') as HTMLAnchorElement | null

  if (target?.classList.contains('cta')) return

  if (target) {
    hoveredLink.value =
      hoveredLink.value && hoveredLink.value.url === target.href
        ? hoveredLink.value
        : {
            url: target.href,
            title: target.title || target.textContent || '',
          }
  }
}

function hideTooltip() {
  hoveredLink.value = undefined
}
</script>

<template>
  <Suspense suspensible>
    <template v-if="title === 'embed' || $slots.default?.()[0]?.children === 'embed'">
      <img :src="href" alt="embed" class="aspect-video w-full object-cover" v-bind="attrs" />
    </template>
    <template v-else-if="title === 'video' || $slots.default?.()[0]?.children === 'video'">
      <!-- extract YouTube video ID and embed -->
      <iframe :src="`https://www.youtube.com/embed/${href.split('/').pop()}?controls=0`" title="YouTube video player" frameborder="0" allowfullscreen class="aspect-video w-full" v-bind="attrs" />
    </template>
    <NuxtLink
      v-else-if="!href.startsWith('#')"
      :to="href + '?utm_source=redcatpictures.com'"
      external
      target="_blank"
      rel="noopener"
      v-bind="attrs"
      class="relative"
      @touchstart.capture="showTooltip"
      @touchend.capture="hideTooltip"
      @touchcancel.capture="hideTooltip"
      @focusin.capture="showTooltip"
      @focusout.capture="hideTooltip"
      @mouseover.capture="showTooltip"
      @mouseleave.capture="hideTooltip">
      <MDCSlot unwrap="p" />
      <LazyLinkToolTip :active-link="hoveredLink" hydrate-on-idle />
    </NuxtLink>
    <NuxtLink v-else internal :to="href" :title="title" v-bind="attrs">
      <slot />
    </NuxtLink>
  </Suspense>
</template>

<style lang="css" scoped>
a {
  @apply whitespace-normal;
}
</style>
