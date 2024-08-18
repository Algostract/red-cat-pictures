<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
  tabs: {
    title: Categories
    icon: string
  }[]
  activeTab: Categories
}>()

const emit = defineEmits<{ (event: 'changeTab', value: Categories): void }>()

function objectToClass({ sm, md }: { sm: Position; md: Position }, size: string) {
  const aspectRatio = { s: 1.57, m: 0.67, l: 1.39 }[size]
  return `row-start-${sm.row.start} md:row-start-${md.row.start} row-span-${sm.row.span} md:row-span-${md.row.span} 
	col-start-${sm.col.start} md:col-start-${md.col.start} col-span-${sm.col.span} md:col-span-${md.col.span} aspect-[${aspectRatio}]`
}

const categoryImages = {
  food: usePhoto(props.photos, ['Food-002-001', 'Food-005-001', 'Food-003-001', 'Food-006-002', 'Food-007-001', 'Food-004-001', 'Food-001-001']),
  product: usePhoto(props.photos, ['Product-004-002', 'Product-005-001', 'Product-006-001', 'Product-008-001', 'Product-002-002', 'Product-003-001', 'Product-001-001']),
}

const images = computed<GallaryImage[]>(() =>
  [
    {
      position: {
        sm: { row: { start: 1, span: 2 }, col: { start: 1, span: 2 } },
        md: { row: { start: 1, span: 2 }, col: { start: 1, span: 2 } },
      },
      size: 'l',
      autoScale: true,
    },
    {
      position: {
        sm: { row: { start: 3, span: 1 }, col: { start: 1, span: 1 } },
        md: { row: { start: 1, span: 1 }, col: { start: 3, span: 1 } },
      },
      size: 's',
      autoScale: true,
    },
    {
      position: {
        sm: { row: { start: 4, span: 1 }, col: { start: 1, span: 1 } },
        md: { row: { start: 1, span: 1 }, col: { start: 4, span: 1 } },
      },
      size: 's',
      autoScale: true,
    },
    {
      position: {
        sm: { row: { start: 5, span: 1 }, col: { start: 2, span: 1 } },
        md: { row: { start: 3, span: 1 }, col: { start: 1, span: 1 } },
      },
      size: 's',
      autoScale: true,
    },
    {
      position: {
        sm: { row: { start: 6, span: 1 }, col: { start: 2, span: 1 } },
        md: { row: { start: 3, span: 1 }, col: { start: 2, span: 1 } },
      },
      size: 's',
      autoScale: true,
    },
    {
      position: {
        sm: { row: { start: 3, span: 2 }, col: { start: 2, span: 1 } },
        md: { row: { start: 2, span: 2 }, col: { start: 3, span: 1 } },
      },
      size: 'm',
      autoScale: false,
    },
    {
      position: {
        sm: { row: { start: 5, span: 2 }, col: { start: 1, span: 1 } },
        md: { row: { start: 2, span: 2 }, col: { start: 4, span: 1 } },
      },
      size: 'm',
      autoScale: false,
    },
  ].map((image, index) => {
    return {
      url: categoryImages[props.activeTab].value[index]?.id,
      alt: categoryImages[props.activeTab].value[index]?.title,
      dynamicClass: objectToClass(image.position, image.size),
      autoScale: image.autoScale,
    }
  })
)
</script>

<template>
  <section id="gallery" class="relative h-fit">
    <div class="mx-auto mb-4 flex w-fit gap-4 md:mb-12">
      <ButtonTab v-for="{ icon, title } in tabs" :key="title" :icon="icon" :title="title" :active="activeTab === title" @click="emit('changeTab', title)" />
    </div>
    <div class="relative mx-0 grid grid-cols-2 grid-rows-6 gap-2 md:-mx-12 md:grid-cols-4 md:grid-rows-3">
      <NuxtImg
        v-for="{ url, alt, dynamicClass, autoScale } in images"
        :key="url"
        provider="uploadcare"
        :src="autoScale ? `${url}/-/scale_crop/1280x960/center/` : url + '/-/preview/1280x960/'"
        :alt="alt"
        :width="1280"
        class="h-full w-full overflow-hidden rounded-sm object-cover object-top"
        :class="dynamicClass" />
    </div>
  </section>
</template>

<style>
.img-dynamic {
  @apply size-0;
  @apply col-span-1 col-start-1 row-span-1 row-start-1 aspect-[1.57] sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1 md:col-span-1 md:col-start-1 md:row-span-1 md:row-start-1;
  @apply col-span-2 col-start-2 row-span-2 row-start-2 aspect-[0.67] sm:col-span-2 sm:col-start-2 sm:row-span-2 sm:row-start-2 md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-2;
  @apply col-start-3 row-start-3 aspect-[1.39] sm:col-start-3 sm:row-start-3 md:col-start-3 md:row-start-3;
  @apply col-start-5 row-start-5 sm:col-start-5 sm:row-start-5 md:col-start-5 md:row-start-5;
}
</style>
