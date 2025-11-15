<script setup lang="ts">
const emit = defineEmits<{
  contact: []
}>()
</script>

<template>
  <footer class="mx-auto mt-8 w-full px-2 md:px-4">
    <div class="relative grid h-52 grid-cols-2 grid-rows-2 items-end overflow-hidden bg-white p-6 text-dark-600/50 dark:bg-black dark:text-light-600 md:grid-cols-3 md:grid-rows-3 md:p-8">
      <div class="relative col-start-1 row-start-2 flex flex-col gap-2 justify-self-start text-sm md:row-start-3">
        <NuxtIcon name="local:logo" filled class="absolute -left-[60px] top-0 -translate-y-[56%] text-[309px] opacity-10 md:-left-[104px] md:-translate-y-[37%] md:text-[560px]" />
        <span>&copy; 2024-2025</span>
        <NuxtLink to="https://shirsendu-bairagi.dev" target="__blank" class="flex items-center gap-1">
          <span>Made by</span>
          <NuxtIcon name="local:shba007" filled class="text-[20px]" />
        </NuxtLink>
      </div>
      <ButtonCTA class="col-span-2 col-start-1 row-start-1 self-center justify-self-center md:col-span-1 md:col-start-2 md:row-start-2" @click="emit('contact')" />
      <ul class="col-start-2 row-start-2 flex gap-4 justify-self-end *:text-white *:transition-colors *:duration-500 *:ease-out hover:*:text-dark-600 md:col-start-3 md:row-start-3 md:gap-8">
        <li>
          <NuxtLink aria-label="whatsapp" to="https://wa.me/c/918910489578" target="_blank" external>
            <NuxtIcon name="local:whatsapp" class="text-[28px] md:text-[40px]" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink aria-label="instagram" to="https://www.instagram.com/redcatpictures" target="_blank" external>
            <NuxtIcon name="local:instagram" class="text-[28px] md:text-[40px]" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink aria-label="facebook" to="https://www.facebook.com/redcatpictures" target="_blank" external>
            <NuxtIcon name="local:facebook" class="text-[28px] md:text-[40px]" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink aria-label="linkedin" to="https://www.linkedin.com/company/red-cat-pictures" target="_blank" external>
            <NuxtIcon name="local:linkedin" class="text-[28px] md:text-[40px]" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink aria-label="youtube" to="https://www.youtube.com/@red_cat_pictures" target="_blank" external>
            <NuxtIcon name="local:youtube" class="text-[28px] md:text-[40px]" />
          </NuxtLink>
        </li>
        <li>
          <NuxtLink aria-label="google" to="https://maps.app.goo.gl/a5RZtb1rxHC8MoaY6" target="_blank" external>
            <NuxtIcon name="local:map" class="text-[28px] md:text-[40px]" />
          </NuxtLink>
        </li>
      </ul>
    </div>
    <ul class="mx-auto mb-1 mt-5 flex w-min items-center justify-between gap-3 text-xs md:gap-4 md:text-sm">
      <li>
        <NuxtLink to="/terms">Terms</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/privacy">Privacy</NuxtLink>
      </li>
      <li>
        <NuxtLink to="/cancellation">Cancellation</NuxtLink>
      </li>
    </ul>
  </footer>
</template>
