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
    icon: 'cart',
    title: 'ecommerce',
  },
  {
    icon: 'photo',
    title: 'product',
  },
  {
    icon: 'pizza',
    title: 'food',
  },
])
</script>

<template>
  <ul class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-0.5 overflow-hidden rounded bg-white">
    <ButtonLabel
      v-for="{ icon, title } in categories"
      :key="title"
      :icon="icon"
      :title="title"
      :active="title === activeCategory"
      :collapsable="true"
      class="scale-110 rounded-none md:w-[195px]"
      @click="emit('update', title)" />
  </ul>
</template>
