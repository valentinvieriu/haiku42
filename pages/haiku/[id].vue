<template>
  <div class="h-screen overflow-hidden">
    <BackgroundImage
      :image-url="backgroundUrl"
      :loading="haikuLoading"
      @loadNew="handleGenerateNewHaiku"
    />
    <main class="absolute bottom-[13%] left-0 right-0 p-8 bg-white bg-opacity-95">
      <ClientOnly>
        <Suspense>
          <HaikuDisplay 
            v-if="haiku"
            :key="haiku.id"
            :haiku="[haiku.firstLine, haiku.secondLine, haiku.thirdLine]" 
            :loading="haikuLoading"
            @loadNew="handleGenerateNewHaiku"
            class="text-2xl md:text-4xl"
          />
          <template #fallback>
            <div class="text-2xl md:text-4xl text-gray-500">
              Loading haiku...
            </div>
          </template>
        </Suspense>
      </ClientOnly>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HaikuDisplay from '~/components/HaikuDisplay.vue'
import BackgroundImage from '~/components/BackgroundImage.vue'

const route = useRoute()
const router = useRouter()

// Local state
const haiku = ref(null)
const haikuLoading = ref(false)
const backgroundUrl = ref('')
const error = ref(null)

// Fetch Haiku
const fetchHaiku = async (id = null) => {
  haikuLoading.value = true
  try {
    const data = await $fetch(`/api/haiku${id ? `?id=${id}` : ''}`)
    haiku.value = data
  } catch (err) {
    console.error('Error fetching haiku:', err)
    error.value = err
  } finally {
    haikuLoading.value = false
  }
}

// Set Background Image
const setBackgroundImage = async (id, provider = 'lexica') => {
  if (!haikuLoading.value) {
    backgroundUrl.value = `/api/haiku-image?id=${id}&provider=${provider}`
  } else {
    backgroundUrl.value = ''
  }
}

// Generate New Haiku
const generateNewHaiku = async () => {
  haikuLoading.value = true  
  try {
    const data = await $fetch('/api/haiku', { method: 'POST' })
    if (data && data.id) {
      return data.id
    }
  } catch (err) {
    console.error('Failed to generate new haiku:', err)
    error.value = err
  } finally {
    haikuLoading.value = false
  }
}

// Load Haiku
const loadHaiku = async (id) => {
  await fetchHaiku(id)
  setBackgroundImage(id, 'together')
}

// Handle Generate New Haiku
const handleGenerateNewHaiku = async () => {
  const id = await generateNewHaiku()
  if (id) {
    await router.push({ path: `/haiku/${id}` })
  }
}

definePageMeta({
  layout: 'default'
})

// Watch for route changes
watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      await loadHaiku(newId)
    }
  },
  { immediate: true }
)

useHead({
  title: () => `Haiku: ${haiku.value?.topic || 'Inspiring Words'}`,
  description: () => haiku.value 
    ? `Experience a moment of zen with this haiku about ${haiku.value.topic}: "${haiku.value.firstLine} / ${haiku.value.secondLine} / ${haiku.value.thirdLine}". Discover more poetic inspirations on our site.`
    : 'Discover inspiring haikus paired with beautiful images. A new poetic experience awaits you.',
  ogImage: () => backgroundUrl.value
})
</script>
