<script setup lang="ts">
const {
  public: { siteUrl },
} = useRuntimeConfig()
</script>

<template>
  <Suspense suspensible>
    <template v-if="true">
      <NuxtLink :to="`${siteUrl}/photo`" class="cta secondary-btn" target="_blank" rel="noopener">
        <MDCSlot unwrap="p" />
      </NuxtLink>
    </template>
    <template v-else>
      <button class="cta secondary-btn">
        <MDCSlot unwrap="p" />
      </button>
    </template>
  </Suspense>
</template>
