<script setup lang="ts">
const props = defineProps<{ photos: string }>()

const { data } = await useFetch('/api/photo', { default: () => [] })

const activePhotoName = useState<string>()
const activePhotoIds = computed(() => props.photos.split(','))

const allPhotos = computed(() => data.value.filter(({ id }) => activePhotoIds.value.includes(id)))
</script>

<template>
  <Suspense suspensible>
    <div class="relative z-10 grid grid-cols-3 gap-2">
      <NuxtLink v-for="{ id, title, image, description, url } in allPhotos" :key="id" :to="url">
        <NuxtImg
          :src="image"
          :alt="description"
          :width="480"
          :height="Math.round(480 / (1 / 1))"
          fit="cover"
          loading="lazy"
          :placeholder="[120, Math.round(120 / (1 / 1)), 50, 5]"
          class="w-full bg-light-600 object-cover dark:bg-dark-500"
          :class="{ active: activePhotoName === title }" />
      </NuxtLink>
    </div>
  </Suspense>
</template>

<style scoped>
img.active {
  view-transition-name: selected-photo;
}
</style>
