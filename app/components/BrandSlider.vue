<script setup lang="ts">
const { data: clients } = await useAPI('/api/client')

const slider = useTemplateRef<HTMLDivElement>('sliderRef')
const isPlay = shallowRef(true)

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
  isPlay.value = entry?.isIntersecting || false
}

useIntersectionObserver(slider, onIntersectionObserver)
</script>

<template>
  <section v-if="clients" ref="sliderRef" class="text-shadow-none relative bottom-0 w-screen text-white md:bottom-8" aria-label="Trusted by our clients" role="region">
    <div class="flex items-center gap-0 bg-white px-2 dark:bg-black md:px-20">
      <div class="h-11 w-2 bg-[url('assets/images/line.svg')]" />
      <div class="trap w-full bg-gradient-to-r from-primary-500 to-transparent to-75% md:max-w-[700px]">
        <div
          class="autoscroll-x flex w-fit gap-12 md:gap-16"
          :style="{
            animationDuration: !isPlay ? '0s' : 3.0 * clients.length + 's',
          }">
          <template v-for="dupIndex in [1, 2]" :key="dupIndex">
            <template v-for="{ id, name, website, logo } in clients" :key="id">
              <NuxtLink
                v-if="extractCdnId(logo)"
                :href="website ? `${website}?utm_source=redcatpictures.com` : ''"
                target="_blank"
                rel="noopener"
                class="relative size-11 overflow-hidden rounded-full bg-black dark:bg-white"
                :aria-label="`Visit ${name} website`">
                <NuxtImg :src="extractCdnId(logo)" :alt="name" :width="64" :height="64" fit="contain" loading="lazy" />
              </NuxtLink>
            </template>
          </template>
        </div>
      </div>
      <div class="-ml-20 flex translate-x-12 gap-5 overflow-visible md:ml-0 md:-translate-x-8">
        <div class="strip" />
        <div class="strip" />
        <div class="strip" />
      </div>
      <span class="ml-6 hidden whitespace-nowrap text-lg font-semi-bold uppercase text-black dark:text-white lg:inline"> Trusted Us </span>
    </div>
  </section>
</template>

<style scoped>
.text-shadow-none {
  text-shadow: none;
}

.strip {
  @apply h-11 w-2 rotate-45 scale-y-125 bg-[url('assets/images/line.svg')];
}

.trap {
  --cut: 64px;
  clip-path: polygon(0 0, 100% 0, calc(100% - var(--cut)) 100%, 0 100%);
}
</style>
