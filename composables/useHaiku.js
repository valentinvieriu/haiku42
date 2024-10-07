import { useState } from '#app'

export const useHaiku = () => {
    const haiku = useState('haiku', () => null)
    const haikuLoading = useState('haikuLoading', () => false)
    const imageLoading = useState('imageLoading', () => false)
    const backgroundUrl = useState('backgroundUrl', () => '')
    const error = useState('haikuError', () => null)
  
    const fetchHaiku = async (id = null) => {
      haikuLoading.value = true
      try {
        const { data } = await useFetch('/api/haiku', {
          params: id ? { id } : {},
          key: id ? `haiku-${id}` : 'haiku',
        })
        haiku.value = data.value
      } catch (error) {
        console.error('Error fetching haiku:', error)
      } finally {
        haikuLoading.value = false
      }
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
      try {
        const { data } = await useFetch('/api/haiku', { method: 'POST' })
        if (data.value && data.value.id) {
          const id = data.value.id
          return id
        }
      } catch (error) {
        console.error('Failed to generate new haiku:', error)
      } finally {
        haikuLoading.value = false
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
  }