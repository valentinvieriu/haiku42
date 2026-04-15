<template>
  <div class="h-screen overflow-hidden">
    <BackgroundImage
      :image-url="backgroundUrl"
      :loading="haikuLoading || generating"
      @loadNew="handleGenerateNewHaiku"
    />

    <main class="absolute bottom-[13%] left-0 right-0 p-8 bg-white bg-opacity-95">
      <ClientOnly>
        <Suspense>
          <HaikuDisplay
            v-if="haiku && !generating"
            :key="route.params.id"
            :haiku="[haiku.firstLine, haiku.secondLine, haiku.thirdLine]"
            :loading="haikuLoading || generating"
            @loadNew="handleGenerateNewHaiku"
            class="text-2xl md:text-4xl"
          />
          <SkeletonHaiku v-else />
          <template #fallback>
            <SkeletonHaiku />
          </template>
        </Suspense>
      </ClientOnly>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HaikuDisplay from '~/components/HaikuDisplay.vue'
import BackgroundImage from '~/components/BackgroundImage.vue'
import SkeletonHaiku from '~/components/SkeletonHaiku.vue'

const route = useRoute()
const router = useRouter()

definePageMeta({
  layout: 'default'
})

// SSR-safe data fetching — deduplicates across server/client
const { data: haiku, error, status } = await useAsyncData(
  () => $fetch(`/api/haiku?id=${route.params.id}`),
  { watch: [() => route.params.id] }
)

const haikuLoading = computed(() => status.value === 'pending')

const backgroundUrl = computed(() => {
  if (import.meta.server || !haiku.value || status.value === 'pending' || generating.value) return ''
  return `/api/haiku-image?id=${route.params.id}`
})

// Generating state
const generating = ref(false)

// Handle Generate New Haiku
const handleGenerateNewHaiku = async () => {
  generating.value = true
  try {
    const data = await $fetch('/api/haiku', { method: 'POST' })
    if (data?.id) {
      await router.push({ path: `/haiku/${data.id}` })
    }
  } catch (err) {
    console.error('Failed to generate new haiku:', err)
  } finally {
    generating.value = false
  }
}

useHead({
  title: () => `Haiku: ${haiku.value?.topic || 'Inspiring Words'}`,
  description: () => haiku.value
    ? `Experience a moment of zen with this haiku about ${haiku.value.topic}: "${haiku.value.firstLine} / ${haiku.value.secondLine} / ${haiku.value.thirdLine}". Discover more poetic inspirations on our site.`
    : 'Discover inspiring haikus paired with beautiful images. A new poetic experience awaits you.',
  ogImage: () => backgroundUrl.value
})
</script>
