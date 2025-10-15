<script setup lang="ts">
defineProps<{
  activeCategory: Category
}>()
const emit = defineEmits<{
  update: [value: Category]
}>()

const categories = ref<
  {
    icon: string
    title: Category
  }[]
>([
  {
    icon: 'photo',
    title: 'product',
  },
  {
    icon: 'pizza',
    title: 'food',
  },
  {
    icon: 'cart',
    title: 'ecommerce',
  },
])

function onClick(title: Category) {
  emit('update', title)
  document.getElementById('featured-photos')!.scrollIntoView({ behavior: 'smooth', inline: 'center' })
}
</script>

<template>
  <div class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-0.5 overflow-hidden rounded bg-white drop-shadow dark:bg-dark-600">
    <ButtonLabel
      v-for="{ icon, title } in categories"
      :key="title"
      :icon="icon"
      :title="title"
      :aria-label="title"
      :active="title === activeCategory"
      :collapsable="true"
      class="flex-1 rounded-none md:w-52"
      @click="onClick(title)" />
  </div>
</template>
