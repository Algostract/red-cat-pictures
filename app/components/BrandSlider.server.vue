<script setup lang="ts">
const { data: clients } = await useAPI('/api/client')
</script>

<template>
  <section v-if="clients" class="w-full px-2 text-white">
    <div class="max-auto flex items-center gap-0">
      <div class="h-20 w-2 bg-[url('assets/images/line.svg')]" />
      <div class="w-full overflow-hidden md:max-w-[700px]">
        <div class="autoscroll-x flex w-fit gap-12 md:gap-16" :style="{ animationDuration: 3.0 * clients.length + 's' }">
          <template v-for="dupIndex in [1, 2]" :key="dupIndex">
            <template v-for="{ id, name, website, logo } in clients" :key="id">
              <NuxtLink
                v-if="extractUploadcareId(logo)"
                :href="website ? `${website}?utm_source=redcatpictures.com` : ''"
                target="__blank"
                external
                class="relative size-16 overflow-hidden rounded-full bg-white">
                <NuxtImg :src="extractUploadcareId(logo)" :alt="name" :width="64" :height="64" fit="contain" loading="lazy" />
              </NuxtLink>
            </template>
          </template>
        </div>
      </div>
      <div class="-mr-14 flex gap-5 overflow-visible md:-ml-12">
        <div class="strip" />
        <div class="strip" />
        <div class="strip" />
      </div>
      <span class="ml-32 hidden whitespace-nowrap text-2xl font-semi-bold uppercase text-white lg:inline">Trusted Us</span>
    </div>
  </section>
</template>

<style scoped>
.strip {
  @apply h-20 w-2 rotate-45 scale-y-125 bg-[url('assets/images/line.svg')];
}
</style>
