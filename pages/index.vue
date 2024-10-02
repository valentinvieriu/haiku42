<template>
  <main class="flex flex-col md:flex-row min-h-screen bg-gray-100">
    <BackgroundImage 
      :imageUrl="backgroundUrl" 
      :loading="loading" 
      @loadNew="loadNewHaiku"
      class="w-full md:w-1/2 h-60 md:h-screen"
    />
    <div class="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
      <transition name="fade" mode="out-in">
        <HaikuDisplay 
          v-if="haiku"
          :key="haikuKey"
          :haiku="[haiku.firstLine, haiku.secondLine, haiku.thirdLine]" 
          @loadNew="loadNewHaiku"
          class="text-lg md:text-2xl"
        />
        <p v-else>Loading haiku...</p>
      </transition>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useHaikuStore } from '~/stores/haiku'
import BackgroundImage from '~/components/BackgroundImage.vue'
import HaikuDisplay from '~/components/HaikuDisplay.vue'

const haikuStore = useHaikuStore()
const haiku = ref(null)
const loading = ref(false)
const backgroundUrl = ref('')
const haikuKey = ref(0)

const loadNewHaiku = async () => {
  loading.value = true
  backgroundUrl.value = '' // Clear the background image
  try {
    await haikuStore.fetchHaiku()
    haiku.value = haikuStore.haiku
    haikuKey.value++ // Force re-render of HaikuDisplay
    updateUrl()
    await updateBackground()
  } catch (error) {
    console.error('Error loading new haiku:', error)
  } finally {
    loading.value = false
  }
}

const updateUrl = () => {
  if (haiku.value) {
    const haikuString = JSON.stringify(haiku.value);
    const haikuId = btoa(haikuString);
    history.pushState(null, '', `#${haikuId}`);
  }
}

const updateBackground = async () => {
  if (!haiku.value) return

  try {
    const { data, error: fetchError } = await useFetch('/api/lexica-image', {
      method: 'POST',
      body: { haiku: haiku.value }
    })

    if (fetchError.value) {
      console.error('Fetch error:', fetchError.value)
      backgroundUrl.value = '/default-background.jpg'
      return
    }

    if (data.value && data.value.imageId) {
      backgroundUrl.value = `https://image.lexica.art/full_jpg/${data.value.imageId}`
    } else {
      console.error('No image ID received from API')
      backgroundUrl.value = '/default-background.jpg'
    }
  } catch (error) {
    console.error('Error fetching Lexica image:', error)
    backgroundUrl.value = '/default-background.jpg'
  }
}

const loadHaikuFromUrl = async () => {
  const haikuId = window.location.hash.slice(1);
  if (haikuId) {
    try {
      const haikuString = atob(haikuId);
      haiku.value = JSON.parse(haikuString);
      await updateBackground();
    } catch (error) {
      console.error('Failed to load haiku from URL:', error);
      await loadNewHaiku();
    }
  } else {
    await loadNewHaiku();
  }
}

onMounted(async () => {
  await loadHaikuFromUrl()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>