<script setup lang="ts">
const props = defineProps<{
  href: string
  title?: string
  rel?: string
  target?: string
  external?: boolean
  noRel?: boolean
  prefetch?: boolean
}>()
const attrs = useAttrs()

const {
  public: { cdnUrl },
} = useRuntimeConfig()

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

const activePhotoName = useState<string | null>()
const activeVideoName = useState<string | null>()

type MediaType = 'video' | 'image' | 'link'

const mediaType = computed<MediaType>(() => {
  if (props.href.includes('/media/video')) {
    return 'video'
  }

  if (props.href.includes('/media/image')) {
    return 'image'
  }

  return 'link'
})
</script>

<template>
  <Suspense suspensible>
    <template v-if="mediaType === 'image'">
      <NuxtLink :to="`/photo/${extractCdnId(href)}`" :rel :target :external :no-rel :prefetch @click="activePhotoName = extractCdnId(href)">
        <NuxtImg
          :src="extractCdnId(href)"
          alt="image"
          :width="Math.round(640 * (16 / 9))"
          :height="640"
          fit="contain"
          loading="eager"
          preload
          :placeholder="[320, Math.round(320 / (16 / 9)), 50, 5]"
          class="aspect-video w-full object-contain"
          v-bind="attrs"
          @contextmenu.prevent />
      </NuxtLink>
    </template>
    <template v-else-if="mediaType === 'video'">
      <NuxtLink :to="`/video/${extractCdnId(href)}`" :rel :target :external :no-rel :prefetch @click="activeVideoName = extractCdnId(href)">
        <NuxtVideo
          v-if="extractCdnId(href)"
          :media="extractCdnId(href)"
          :poster="`${cdnUrl}/media/image/fit_contain&s_1280x720/${extractCdnId(href)}`"
          :disable-picture-in-picture="true"
          controls-list="nodownload"
          :autoplay="true"
          :muted="true"
          :playsinline="true"
          :loop="true"
          preload="metadata"
          css-class="aspect-video" />
      </NuxtLink>
    </template>
    <NuxtLink
      v-else-if="!href.startsWith('#')"
      :to="href + '?utm_source=redcatpictures.com'"
      target="_blank"
      external
      :no-rel
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
    <NuxtLink v-else internal :to="href" :title="title" v-bind="attrs" :rel :target :external :no-rel :prefetch>
      <slot />
    </NuxtLink>
  </Suspense>
</template>

<style lang="css" scoped>
a {
  @apply whitespace-normal;
}
</style>
