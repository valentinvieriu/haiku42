import { defineStore } from 'pinia'

export const useHaikuStore = defineStore('haiku', {
  state: () => ({
    haiku: null,
    haikuLoading: false,
    imageLoading: false,
    backgroundUrl: '',
  }),
  actions: {
    async fetchHaiku(id = null) {
      this.haikuLoading = true
      try {
        const url = id ? `/api/haiku?id=${id}` : '/api/haiku'
        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        this.haiku = await response.json()
      } catch (error) {
        console.error('Error fetching haiku:', error)
      } finally {
        this.haikuLoading = false
      }
    },
    async fetchBackgroundImage(id) {
      this.imageLoading = true
      try {
        this.backgroundUrl = '' // Reset the background URL
        const imageUrl = `/api/haiku-image?id=${id || this.haiku.id}`
        this.backgroundUrl = imageUrl
      } catch (error) {
        console.error('Error fetching background image:', error)
        this.backgroundUrl = '' // Reset on error
      } finally {
        this.imageLoading = false
      }
    },
    async generateNewHaiku() {
      this.haikuLoading = true
      this.imageLoading = true
      try {
        const response = await fetch('/api/haiku', { method: 'POST' })
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const { id } = await response.json()
        await this.fetchHaiku(id)
        await this.fetchBackgroundImage(id)
        return id
      } catch (error) {
        console.error('Error generating new haiku:', error)
      } finally {
        this.haikuLoading = false
        // imageLoading will be set to false in fetchBackgroundImage
      }
    },
  },
})