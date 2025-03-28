<script setup lang="ts">
const { data: clients } = await useFetch('/api/client')
</script>

<template>
  <section v-if="clients" class="w-full text-white md:p-4">
    <div class="max-auto flex items-center gap-0">
      <div class="h-20 w-2 bg-[url('assets/images/line.svg')]" />
      <div class="w-full overflow-hidden md:max-w-[700px]">
        <div class="autoscroll flex w-fit gap-12 md:gap-16" :style="{ animationDuration: 3.0 * clients.length + 's' }">
          <template v-for="dupIndex in [1, 2]" :key="dupIndex">
            <template v-for="{ id, name, website, logo } in clients" :key="id">
              <NuxtLink v-if="logo" :href="website ? `${website}?utm_source=redcatpictures.com` : ''" target="__blank" external class="relative size-16 overflow-hidden rounded-full bg-white">
                <NuxtImg :src="logo" :alt="name" width="64" height="64" class="object-contain" />
              </NuxtLink>
            </template>
          </template>
        </div>
      </div>
      <div class="-mr-14 flex gap-5 overflow-visible md:-ml-12">
        <div class="h-20 w-2 rotate-45 scale-y-125 bg-[url('assets/images/line.svg')]" />
        <div class="h-20 w-2 rotate-45 scale-y-125 bg-[url('assets/images/line.svg')]" />
        <div class="h-20 w-2 rotate-45 scale-y-125 bg-[url('assets/images/line.svg')]" />
      </div>
      <span class="ml-32 hidden whitespace-nowrap text-2xl font-semi-bold text-black dark:text-white lg:inline">Worked with Us</span>
    </div>
  </section>
</template>

<style scoped>
.overlay {
  @apply after:fixed after:left-0 after:top-0 after:z-20 after:h-screen after:w-screen after:bg-gradient-to-b after:from-black/40 after:from-[3%] after:via-transparent after:via-20% after:to-black/40 after:to-[97%] after:content-[''];
}

.autoscroll {
  animation: scroll linear infinite;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
</style>
