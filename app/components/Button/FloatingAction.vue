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
  <div class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-0.5 overflow-hidden bg-white shadow-[0_0_28px_10px_rgba(205,45,45,0.3)] dark:bg-black">
    <ButtonLabel
      v-for="{ icon, title } in categories"
      :key="title"
      :icon="icon"
      :title="title"
      :aria-label="title"
      :active="title === activeCategory"
      :collapsable="true"
      class="flex-1 bg-white dark:bg-black md:w-52"
      @click="onClick(title)" />
  </div>
</template>
