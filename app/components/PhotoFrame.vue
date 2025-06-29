<script setup lang="ts">
const props = defineProps<{
  photo: string
  aspectRatio: number
  position?: [number, number, number]
}>()

const woodTexture = await useTexture({
  map: 'https://images.unsplash.com/photo-1644924604597-373500f4cf28?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
})
const photoTexture = await useTexture({ map: props.photo })

const frameWidth = 3 * props.aspectRatio
const frameHeight = 3
const frameDepth = 0.1
</script>

<template>
  <TresGroup :position="props.position || [0, 0, 0]">
    <TresMesh>
      <TresBoxGeometry :args="[frameWidth + 0.2, frameHeight + 0.2, frameDepth]" />
      <TresMeshStandardMaterial :map="woodTexture.map" />
    </TresMesh>

    <TresMesh :position="[0, 0, frameDepth / 2 + 0.01]">
      <TresPlaneGeometry :args="[frameWidth, frameHeight]" />
      <TresMeshStandardMaterial :map="photoTexture.map" />
    </TresMesh>
  </TresGroup>
</template>
