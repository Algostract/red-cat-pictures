<script setup lang="ts">
const props = defineProps<{
  images: Photo[]
  activeCategory: Category
}>()

function objectToClass({ sm, md }: { sm: Position; md: Position }, size: string) {
  const aspectRatio = { s: 1.57, m: 0.67, l: 1.39 }[size]
  return `row-start-${sm.row.start} md:row-start-${md.row.start} row-span-${sm.row.span} md:row-span-${md.row.span} 
	col-start-${sm.col.start} md:col-start-${md.col.start} col-span-${sm.col.span} md:col-span-${md.col.span} aspect-[${aspectRatio}]`
}

const categoryImages = {
  ecommerce: usePhoto(props.images, ['Ecommerce-012-001', 'Ecommerce-002-002', 'Product-005-001', 'Ecommerce-003-002', 'Product-010-001', 'Ecommerce-001-004', 'Ecommerce-008-002']),
  product: usePhoto(props.images, ['Product-004-002', 'Product-015-002', 'Product-006-001', 'Product-016-006', 'Product-002-002', 'Product-013-001', 'Product-001-001']),
  food: usePhoto(props.images, ['Food-002-002', 'Food-005-001', 'Food-003-001', 'Food-012-001', 'Food-023-001', 'Food-004-001', 'Food-001-001']),
}

const images = computed<GalleryPhoto[]>(() =>
  [
    {
      position: {
        sm: { row: { start: 1, span: 2 }, col: { start: 1, span: 2 } },
        md: { row: { start: 1, span: 2 }, col: { start: 1, span: 2 } },
      },
      size: 'l',
      aspectRatio: 1.356,
    },
    {
      position: {
        sm: { row: { start: 3, span: 1 }, col: { start: 1, span: 1 } },
        md: { row: { start: 1, span: 1 }, col: { start: 3, span: 1 } },
      },
      size: 's',
      aspectRatio: 1.362,
    },
    {
      position: {
        sm: { row: { start: 4, span: 1 }, col: { start: 1, span: 1 } },
        md: { row: { start: 1, span: 1 }, col: { start: 4, span: 1 } },
      },
      size: 's',
      aspectRatio: 1.362,
    },
    {
      position: {
        sm: { row: { start: 5, span: 1 }, col: { start: 2, span: 1 } },
        md: { row: { start: 3, span: 1 }, col: { start: 1, span: 1 } },
      },
      size: 's',
      aspectRatio: 1.362,
    },
    {
      position: {
        sm: { row: { start: 6, span: 1 }, col: { start: 2, span: 1 } },
        md: { row: { start: 3, span: 1 }, col: { start: 2, span: 1 } },
      },
      size: 's',
      aspectRatio: 1.362,
    },
    {
      position: {
        sm: { row: { start: 3, span: 2 }, col: { start: 2, span: 1 } },
        md: { row: { start: 2, span: 2 }, col: { start: 3, span: 1 } },
      },
      size: 'm',
      aspectRatio: 0.67,
    },
    {
      position: {
        sm: { row: { start: 5, span: 2 }, col: { start: 1, span: 1 } },
        md: { row: { start: 2, span: 2 }, col: { start: 4, span: 1 } },
      },
      size: 'm',
      aspectRatio: 0.67,
    },
  ].map((image, index) => {
    return {
      name: categoryImages[props.activeCategory].value[index]?.name,
      id: categoryImages[props.activeCategory].value[index]?.id,
      alt: categoryImages[props.activeCategory].value[index]?.title,
      dynamicClass: objectToClass(image.position, image.size),
      aspectRatio: image.aspectRatio,
    }
  })
)

const activeImageName = useState()
</script>

<template>
  <section id="featured-images" class="relative h-fit">
    <SectionLabel icon="photo" title="Featured Images" />
    <div class="relative -mx-2 grid grid-cols-2 grid-rows-6 gap-2 md:grid-cols-4 md:grid-rows-3 lg:-mx-12">
      <NuxtLink v-for="{ name, id, alt, dynamicClass, aspectRatio } in images" :key="id" :to="`/images/${name}`" :class="dynamicClass" class="size-full" @click="activeImageName = name">
        <NuxtImg
          provider="uploadcare"
          :src="id"
          :alt="alt"
          :width="640"
          :height="Math.round(640 / aspectRatio)"
          fit="fill"
          format="auto"
          loading="lazy"
          :query="{ preview: `640x${Math.round(640 / aspectRatio)}` }"
          class="size-full overflow-hidden rounded-sm bg-light-600 dark:bg-dark-500" />
      </NuxtLink>
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
