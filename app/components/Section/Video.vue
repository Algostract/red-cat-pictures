<script setup lang="ts">
const { data: videos } = useFetch('/api/video', { default: () => [] })

const currentVideoIndex = ref(0)
const currentVideo = computed(() => ({ ...videos.value[currentVideoIndex.value] }))

async function updateVideoIndex() {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % videos.value.length
}
</script>

<template>
  <section id="video" class="pb-4">
    <div v-if="videos.length" class="aspect-video w-full overflow-hidden rounded-2xl border border-primary-400 bg-black">
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
