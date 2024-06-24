import { defineStore } from 'pinia';

export const useHaikuStore = defineStore('haiku', {
  state: () => ({
    haiku: null,
  }),
  actions: {
    async fetchHaiku() {
      try {
        const response = await fetch('/api/haiku');
        this.haiku = await response.json();
      } catch (error) {
        console.error('Error fetching haiku:', error);
      }
    },
  },
});
