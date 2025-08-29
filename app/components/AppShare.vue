<script setup lang="ts">
const { share, isSupported: isWebShareSupported } = useShare()
const route = useRoute()

const props = defineProps<{
  title: string
  description: string
  url: string
}>()

// Share functionality
const { copy, isSupported: isClipboardSupported } = useClipboard()

async function shareWebsite() {
  const shareData = {
    title: props.title,
    text: props.description,
    url: props.url,
  }

  try {
    if (isWebShareSupported.value) {
      await share(shareData)
    } else if (isClipboardSupported.value) {
      await copy(route.fullPath)

      console.log('URL copied to clipboard!')
    }
  } catch (error) {
    console.error('Error sharing:', error)
  }
}
</script>

<template>
  <button aria-label="share" class="text-white transition-colors duration-500 ease-out hover:text-dark-600" @click="shareWebsite">
    <NuxtIcon name="local:share" class="text-[28px] md:text-[28px]" />
  </button>
</template>
