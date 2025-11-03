<script setup lang="ts">
const props = defineProps<{ content: string }>()
</script>

<template>
  <div class="relative">
    <MDC :value="props.content" class="content relative" />
  </div>
</template>

<style>
.content h1 {
  @apply my-4 text-xl font-semi-bold md:text-3xl;
}

.content h2 {
  @apply my-3 text-lg font-semi-bold md:text-2xl;
}

.content h3 {
  @apply my-2 text-base font-semi-bold text-alert-600 md:text-xl;
}

.content h4 {
  @apply my-1 text-sm font-semi-bold md:text-lg;
}

.content p {
  @apply my-2 font-light md:my-4 md:text-[1.125rem] 2xl:text-xl 2xl:leading-relaxed;
}

.content > img {
  @apply mx-auto my-4 aspect-video max-h-[18rem] w-full rounded-md object-cover md:my-8;
}

.content aside {
  @apply my-2 flex items-start gap-1 rounded bg-dark-600/20 p-4;
}

.content aside > img {
  @apply w-7;
}

.content aside > p {
  @apply my-0;
}

.content strong {
  @apply font-semi-bold;
}

.content ol {
  @apply ml-8 list-decimal;
}

.content ul {
  @apply ml-8 list-disc;
}

.content a {
  @apply whitespace-nowrap underline underline-offset-1;
}

.content h1 > a,
h2 > a,
h3 > a {
  @apply !whitespace-break-spaces !no-underline;
}

.content blockquote {
  @apply border-l-4 border-primary-500 pl-4;
}

.content iframe {
  @apply relative block aspect-video w-full;
}

.content .cta.secondary-btn {
  @apply mx-auto block w-fit bg-primary-500 px-4 py-1 text-white no-underline decoration-transparent;
}
</style>
