import { defineStore } from 'pinia'

export const useHaikuStore = defineStore('haiku', {
  state: () => ({
    haiku: null,
  }),
  actions: {
    async fetchHaiku(id = null) {
      try {
        const url = id ? `/api/haiku?id=${id}` : '/api/haiku';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.haiku = await response.json();
      } catch (error) {
        console.error('Error fetching haiku:', error);
        throw error;
      }
    },
  },
})