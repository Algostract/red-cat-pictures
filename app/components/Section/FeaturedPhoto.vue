<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
  activeCategory: Category
  activePhoto?: string
}>()

const emit = defineEmits<{
  active: [value: string]
}>()

function objectToClass({ sm, md }: { sm: Position; md: Position }, size: string) {
  const aspectRatio = { s: 1.57, m: 0.67, l: 1.39 }[size]
  return `row-start-${sm.row.start} md:row-start-${md.row.start} row-span-${sm.row.span} md:row-span-${md.row.span} 
	col-start-${sm.col.start} md:col-start-${md.col.start} col-span-${sm.col.span} md:col-span-${md.col.span} aspect-[${aspectRatio}]`
}

const categoryPhotos = {
  ecommerce: props.photos.filter(({ featured, category }) => featured !== null && category === 'ecommerce').toSorted((a, b) => a.featured! - b.featured!),
  product: props.photos.filter(({ featured, category }) => featured !== null && category === 'product').toSorted((a, b) => a.featured! - b.featured!),
  food: props.photos.filter(({ featured, category }) => featured !== null && category === 'food').toSorted((a, b) => a.featured! - b.featured!),
}

const photos = computed<GalleryPhoto[]>(() =>
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
  ]
    .map((photo, index): GalleryPhoto | null => {
      if (!categoryPhotos[props.activeCategory][index]) return null

      return {
        id: categoryPhotos[props.activeCategory][index]!.id,
        image: categoryPhotos[props.activeCategory][index]!.image!,
        title: categoryPhotos[props.activeCategory][index]!.title,
        description: categoryPhotos[props.activeCategory][index]!.description,
        dynamicClass: objectToClass(photo.position, photo.size),
        aspectRatio: photo.aspectRatio,
        url: categoryPhotos[props.activeCategory][index]!.url,
      }
    })
    .filter((item) => item !== null)
)
</script>

<template>
  <section id="featured-photos" class="relative h-fit">
    <SectionLabel icon="photo" title="Featured Photos" />
    <div class="relative grid grid-cols-2 grid-rows-6 gap-2 md:grid-cols-4 md:grid-rows-3">
      <NuxtLink v-for="{ id, title, image, description, dynamicClass, aspectRatio, url } in photos" :key="id" :to="url" :class="dynamicClass" class="size-full" @click="emit('active', title)">
        <NuxtImg
          :src="extractCdnId(image)"
          :alt="description"
          :width="700"
          :height="Math.round(700 / aspectRatio)"
          fit="cover"
          loading="lazy"
          :placeholder="[350, Math.round(350 / aspectRatio), 50, 5]"
          class="size-full overflow-hidden rounded-sm bg-light-600 object-cover dark:bg-dark-500"
          :class="{ active: activePhoto === title }" />
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
img.active {
  view-transition-name: selected-photo;
}
</style>

<style>
.img-dynamic {
  @apply size-0;
  @apply col-span-1 col-start-1 row-span-1 row-start-1 aspect-[1.57] sm:col-span-1 sm:col-start-1 sm:row-span-1 sm:row-start-1 md:col-span-1 md:col-start-1 md:row-span-1 md:row-start-1;
  @apply col-span-2 col-start-2 row-span-2 row-start-2 aspect-[0.67] sm:col-span-2 sm:col-start-2 sm:row-span-2 sm:row-start-2 md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-2;
  @apply col-start-3 row-start-3 aspect-[1.39] sm:col-start-3 sm:row-start-3 md:col-start-3 md:row-start-3;
  @apply col-start-5 row-start-5 sm:col-start-5 sm:row-start-5 md:col-start-5 md:row-start-5;
}
</style>
