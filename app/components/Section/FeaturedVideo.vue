<script setup lang="ts">
const props = defineProps<{
  videos: Video[]
  activeCategory: Category
}>()

const currentVideoIndex = ref(0)
const currentVideo = computed(() => ({ ...props.videos[currentVideoIndex.value]! }))

async function updateVideoIndex() {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % props.videos.length
}
</script>

<template>
  <section id="featured-videos" class="pb-4">
    <SectionLabel icon="movie" title="Featured Videos" />
    <div v-if="videos.length" class="relative left-1/2 aspect-video w-screen -translate-x-1/2 overflow-hidden bg-black">
      <NuxtVideo
        :key="currentVideoIndex"
        :source="currentVideo.sources"
        :poster="currentVideo.poster"
        :disable-picture-in-picture="true"
        controls-list="nodownload"
        :autoplay="true"
        :muted="true"
        :playsinline="true"
        preload="metadata"
        @ended="updateVideoIndex" />
    </div>
  </section>
</template>
