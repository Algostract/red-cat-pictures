<script setup lang="ts">
const { data: videos } = useFetch('/api/video', { default: () => [] })

const videoRef = ref<HTMLVideoElement>()
const currentVideoIndex = ref(0)
const currentVideo = computed(() => videos.value[currentVideoIndex.value])

async function updateVideoIndex() {
  if (!videoRef.value) return

  currentVideoIndex.value = (currentVideoIndex.value + 1) % videos.value.length
  console.log({ currentVideoIndex: currentVideoIndex.value, currentVideo: currentVideo.value })
  videoRef.value.pause()
  videoRef.value.currentTime = 0
  await videoRef.value.play()
}
</script>

<template>
  <section id="video" class="pb-4">
    <div v-if="videos.length" class="aspect-video w-full overflow-hidden rounded-2xl bg-black">
      <video
        :key="currentVideo.url"
        ref="videoRef"
        :poster="currentVideo.poster"
        width="100%"
        video="100%"
        disablePictureInPicture
        controlsList="nodownload"
        :autoplay="true"
        :muted="true"
        :playsinline="true"
        preload="metadata"
        @ended="updateVideoIndex">
        <source :src="currentVideo.url" :type="currentVideo.mime" />
      </video>
    </div>
  </section>
</template>
