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
          <div v-else>
            <SkeletonHaiku />
            <ThinkingDisplay
              :text="thinkingText"
              :visible="isThinking"
            />
          </div>
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
import ThinkingDisplay from '~/components/ThinkingDisplay.vue'

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
const thinkingText = ref('')
const isThinking = ref(false)

// Handle Generate New Haiku
const handleGenerateNewHaiku = async () => {
  generating.value = true
  thinkingText.value = ''
  isThinking.value = false

  try {
    await new Promise((resolve, reject) => {
      const evtSource = new EventSource('/api/haiku-stream')
      let stallTimer = null
      let settled = false

      const resetStallTimer = () => {
        clearTimeout(stallTimer)
        stallTimer = setTimeout(() => {
          if (settled) return
          settled = true
          evtSource.close()
          reject(new Error('Haiku generation timed out'))
        }, 120000)
      }

      resetStallTimer()

      evtSource.onmessage = async (event) => {
        resetStallTimer()
        let data
        try { data = JSON.parse(event.data) } catch { return }

        switch (data.type) {
          case 'thinking':
            isThinking.value = true
            thinkingText.value += data.text
            break
          case 'content':
            // Content is the final JSON answer — don't display it as thinking.
            isThinking.value = true
            break
          case 'complete':
            if (settled) return
            settled = true
            clearTimeout(stallTimer)
            evtSource.close()
            if (data.id) await router.push({ path: `/haiku/${data.id}` })
            resolve()
            break
          case 'error':
            if (settled) return
            settled = true
            clearTimeout(stallTimer)
            evtSource.close()
            reject(new Error(data.message))
            break
        }
      }

      evtSource.onerror = () => {
        if (settled) return
        settled = true
        clearTimeout(stallTimer)
        evtSource.close()
        reject(new Error('Failed to connect to haiku stream'))
      }
    })
  } catch (err) {
    console.error('Failed to generate new haiku:', err)
  } finally {
    generating.value = false
    isThinking.value = false
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
