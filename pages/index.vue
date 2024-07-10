<script setup lang="ts">
import type { Categories } from '~/utils/types'

const isModelContactOpen = ref<boolean>(false)

function onContact(action: boolean) {
  if (action) {
    isModelContactOpen.value = true
    useTrackEvent('contact_open')
  } else {
    isModelContactOpen.value = false
    useTrackEvent('contact_close')
  }
}

const tabs = ref([
  {
    icon: 'pizza',
    title: 'food' as const,
  },
  {
    icon: 'box',
    title: 'product' as const,
  },
])

const activeTab = ref<'food' | 'product'>('food')

function changeActiveTab(tab: Categories) {
  activeTab.value = tab
}
</script>

<template>
  <div>
    <AppHeader />
    <main class="relative mx-auto flex max-w-[90rem] flex-col gap-4 overflow-hidden p-4 !pb-0 md:gap-16 md:p-16">
      <SectionHero @contact="onContact(true)" />
      <SectionFeatured />
      <SectionGallery :tabs="tabs" :active-tab="activeTab" @change-tab="changeActiveTab" />
      <SectionPricing :tabs="tabs" :active-tab="activeTab" @change-tab="changeActiveTab" />
      <!-- <SectionTestimonial /> -->
      <ModelContact :is-open="isModelContactOpen" @close="onContact(false)" />
    </main>
    <AppFooter @contact="onContact(true)" />
  </div>
</template>
