<script setup lang="ts">
type ProjectMediaItem =
  | {
      kind: 'photo'
      projectId: string
      id: string
      title: string
      url: string
      description: string
      image?: string
      aspectRatio: number
    }
  | {
      kind: 'video'
      projectId: string
      id: string
      title: string
      description: string
      type: string
      media: string
      poster: string
      aspectRatio: number
      duration: number
      category: string
      gallery: boolean
      featured: null | number
      url: string
      uploadDate: string
    }

const { data: photos } = await useAPI<Photo[]>('/api/photo', { default: (): Photo[] => [] })
const { data: videos } = await useAPI<Video[]>('/api/video', { default: (): Video[] => [] })

const title = 'Projects'
const description = 'All of our projects'
const {
  public: { siteUrl, cdnUrl },
} = useRuntimeConfig()
const imageUrl = photos.value?.length ? `${cdnUrl}/media/image/f_jpeg&fit_cover&s_1200x630/${extractCdnId(photos.value[0]?.image)}` : `${siteUrl}/preview/placeholder-empty.jpg`

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: `${siteUrl}/project`,
})

function extractProjectId(mediaId: string): string {
  const parts = `${mediaId || ''}`.split('-')
  return parts.length >= 2 ? parts[1]! : 'unknown'
}

const mediaItems = computed<ProjectMediaItem[]>(() => {
  const photoItems: ProjectMediaItem[] = (photos.value || []).map((p) => ({
    kind: 'photo',
    projectId: extractProjectId(p.id),
    id: p.id,
    title: p.title,
    url: p.url,
    description: p.description,
    image: p.image,
    aspectRatio: p.aspectRatio,
  }))

  const videoItems: ProjectMediaItem[] = (videos.value || [])
    .filter((v) => !v.id.includes('video-0000-0000'))
    .map((v) => {
      return {
        kind: 'video',
        projectId: extractProjectId(v.id),
        id: v.id,
        title: v.title,
        url: v.url,
        poster: v.poster,
        aspectRatio: v.aspectRatio,
      }
    })

  // Mixed list (not separated by type); adjust order if you want newest-first.
  return [...photoItems, ...videoItems]
})

const projects = computed<Record<string, ProjectMediaItem[]>>(() => {
  return mediaItems.value.reduce(
    (acc, item) => {
      ;(acc[item.projectId] ||= []).push(item)
      return acc
    },
    {} as Record<string, ProjectMediaItem[]>
  )
})

const sortedProjectIds = computed(() => Object.keys(projects.value).sort((a, b) => parseInt(b) - parseInt(a)))

const activeMediaId = useState<string | null>('active-media-id', () => null)
</script>

<template>
  <main class="mx-auto min-h-screen w-full pt-20 md:pt-28">
    <section class="flex flex-col gap-10">
      <div v-for="projectId in sortedProjectIds" :key="projectId" class="flex flex-col gap-3">
        <!--  <h2 class="text-center text-md font-semibold uppercase md:text-xl">
          Project {{ projectId }}
        </h2> -->
        <!-- Mixed masonry: photos + videos together -->
        <div class="columns-2 gap-2 md:columns-4 2xl:columns-6">
          <div
            v-for="item in projects[projectId]"
            :key="item.id"
            class="relative mb-2 break-inside-avoid-column overflow-hidden bg-light-600 transition-transform duration-200 ease-in-out hover:scale-[1.02] dark:bg-dark-500">
            <!-- Photo -->
            <template v-if="item.kind === 'photo'">
              <NuxtLink :to="item.url" @click="activeMediaId = item.id">
                <div class="font-semibold pointer-events-none absolute left-2 top-2 z-10 rounded bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wide text-white">Photo</div>
                <NuxtImg
                  :src="extractCdnId(item.image!)"
                  :alt="item.description"
                  sizes="50vw md:25vw 2xl:16vw"
                  :width="420"
                  :height="Math.round(420 / item.aspectRatio)"
                  fit="cover"
                  loading="lazy"
                  :placeholder="[120, Math.round(120 / item.aspectRatio), 50, 5]"
                  class="size-full object-cover"
                  :class="{ active: activeMediaId === item.id }"
                  :style="{ aspectRatio: item.aspectRatio }"
                  @contextmenu.prevent />
              </NuxtLink>
            </template>
            <!-- Video -->
            <template v-else>
              <NuxtLink :to="item.url" class="block" @mouseenter="activeMediaId = item.id" @mouseleave="activeMediaId = null" @click="activeMediaId = item.id">
                <div class="font-semibold pointer-events-none absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded bg-black/50 px-2 py-1 text-[10px] uppercase tracking-wide text-white">
                  Video
                </div>
                <div class="pointer-events-none absolute inset-0 z-[5] grid place-items-center transition-opacity duration-150">
                  <div class="rounded-full bg-black/40 p-3 backdrop-blur-[1px]">
                    <NuxtIcon v-if="activeMediaId === item.id" name="local:pause" class="fill-white text-[24px]" />
                    <NuxtIcon v-else name="local:play" class="fill-white text-[24px]" />
                  </div>
                </div>
                <div class="w-full overflow-hidden" :style="{ aspectRatio: item.aspectRatio }">
                  <NuxtVideo
                    :media="item.id"
                    :poster="item.poster"
                    :autoplay="activeMediaId === item.id"
                    :state="activeMediaId === item.id ? 'play' : 'pause'"
                    :muted="true"
                    :playsinline="true"
                    :controls="false"
                    :disable-picture-in-picture="true"
                    controls-list="nodownload"
                    preload="metadata"
                    css-class="object-cover" />
                </div>
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
img.active {
  view-transition-name: selected-media;
}

.break-inside-avoid-column {
  break-inside: avoid-column;
}
</style>
