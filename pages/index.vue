<template>
  <main class="flex flex-col items-center min-h-screen bg-gray-100">
    <BackgroundImage 
      :imageUrl="backgroundUrl" 
      :loading="loading" 
      @loadNew="loadNewHaiku"
    />
    <HaikuDisplay 
      v-if="haiku"
      :haiku="[haiku.firstLine, haiku.secondLine, haiku.thirdLine]" 
      @loadNew="loadNewHaiku"
    />
    <p v-else>Loading haiku...</p>
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

const loadNewHaiku = async () => {
  loading.value = true
  try {
    await haikuStore.fetchHaiku()
    haiku.value = haikuStore.haiku
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
    // Convert the haiku object to a string
    const haikuString = JSON.stringify(haiku.value);
    // Encode the string to make it URL-safe
    const haikuId = btoa(haikuString);
    // Use null as the state object instead of haiku.value
    history.pushState(null, '', `#${haikuId}`);
  }
}

const updateBackground = async () => {
  if (!haiku.value) return

  try {
    const { data } = await useFetch('/api/lexica-image', {
      method: 'POST',
      body: { haiku: haiku.value }
    })
    
    if (data.value && data.value.imageId) {
      backgroundUrl.value = `https://image.lexica.art/full_jpg/${data.value.imageId}`
    } else {
      console.error('No image ID received from API')
    }
  } catch (error) {
    console.error('Error fetching Lexica image:', error)
  }
}

// Corresponding loadHaikuFromUrl function
const loadHaikuFromUrl = () => {
  const haikuId = window.location.hash.slice(1);
  if (haikuId) {
    try {
      const haikuString = atob(haikuId);
      haiku.value = JSON.parse(haikuString);
      updateBackground();
    } catch (error) {
      console.error('Failed to load haiku from URL:', error);
      loadNewHaiku();
    }
  } else {
    loadNewHaiku();
  }
}

onMounted(() => {
  loadHaikuFromUrl()
})
</script>