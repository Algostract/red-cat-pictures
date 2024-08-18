<script setup lang="ts">
const emit = defineEmits<{
  (event: 'contact'): void
}>()
</script>

<template>
  <footer
    class="relative z-0 m-4 grid h-52 grid-cols-2 grid-rows-2 items-end overflow-hidden rounded-3xl bg-light-500 p-6 text-dark-600/50 dark:bg-dark-500 dark:text-light-600 md:m-8 md:grid-cols-3 md:grid-rows-3 md:p-8">
    <div class="relative col-start-1 row-start-2 flex flex-col gap-2 justify-self-start text-sm md:row-start-3">
      <NuxtIcon name="logo" class="absolute -left-[60px] top-0 -z-10 -translate-y-[56%] text-[309px] text-white opacity-10 md:-left-[104px] md:-translate-y-[37%] md:text-[560px]" />
      <span>&copy; 2024-2025</span>
      <NuxtLink to="https://shirsendu-bairagi.dev" target="__blank" class="flex items-center gap-1">
        <span>Made by</span>
        <NuxtIcon name="shba007" filled class="text-[20px]" />
      </NuxtLink>
    </div>
    <ButtonCTA :primary="false" class="col-span-2 col-start-1 row-start-1 self-center justify-self-center md:col-span-1 md:col-start-2 md:row-start-2" @click="emit('contact')" />
    <ul class="col-start-2 row-start-2 flex gap-4 justify-self-end *:transition-colors *:duration-500 *:ease-out hover:*:text-white md:col-start-3 md:row-start-3 md:gap-8">
      <li>
        <NuxtLink to="https://www.facebook.com/redcatxpictures" target="_blank">
          <NuxtIcon name="facebook" class="text-[28px] md:text-[40px]" />
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="https://www.instagram.com/redcatxpictures" target="_blank">
          <NuxtIcon name="instagram" class="text-[28px] md:text-[40px]" />
        </NuxtLink>
      </li>
      <!-- <li>
				<NuxtLink to="https://www.youtube.com/" target="_blank">
					<NuxtIcon name="youtube" class="text-[28px] md:text-[40px]" />
				</NuxtLink>
			</li> -->
    </ul>
  </footer>
</template>
