import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHaikuStore = defineStore('haiku', () => {
  const haiku = ref(null)
  const haikuLoading = ref(false)
  const imageLoading = ref(false)
  const backgroundUrl = ref('')

  const fetchHaiku = async (id = null) => {
    haikuLoading.value = true
    const { data, error } = await useFetch('/api/haiku', {
      query: id ? { id } : {},
      key: id ? `haiku-${id}` : 'haiku',
    })

    if (error.value) {
      console.error('Error fetching haiku:', error.value)
    } else {
      haiku.value = data.value
    }

    haikuLoading.value = false
  }

  const fetchBackgroundImage = async (id) => {
    imageLoading.value = true
    backgroundUrl.value = ''

    const imageUrl = `/api/haiku-image?id=${id || haiku.value?.id}`
    backgroundUrl.value = imageUrl

    imageLoading.value = false
  }

  const generateNewHaiku = async () => {
    haikuLoading.value = true
    imageLoading.value = true

    try {
      const { data, error } = await useFetch('/api/haiku', {
        method: 'POST',
        key: 'generate-haiku',
      })

      if (error.value) {
        console.error('Error generating new haiku:', error.value)
        throw error.value
      }

      if (!data.value || !data.value.id) {
        throw new Error('No haiku ID returned from the server')
      }

      const id = data.value.id
      await fetchHaiku(id)
      await fetchBackgroundImage(id)
      return id
    } catch (error) {
      console.error('Failed to generate new haiku:', error)
      // You might want to set an error state here
    } finally {
      haikuLoading.value = false
      imageLoading.value = false
    }
  }

  return {
    haiku,
    haikuLoading,
    imageLoading,
    backgroundUrl,
    fetchHaiku,
    fetchBackgroundImage,
    generateNewHaiku,
  }
})