<template>
  <div class="skeleton-haiku">
    <div class="h-6 bg-gray-300 rounded mb-4"></div>
    <div class="h-6 bg-gray-300 rounded mb-4"></div>
    <div class="h-6 bg-gray-300 rounded mb-4"></div>
    <p class="text-sm text-gray-400 text-center mt-2">{{ currentVerb }} a new haiku...</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getRandomVerb } from '~/utils/funVerbs'

const currentVerb = ref('Generating')
let verbInterval = null

onMounted(() => {
  verbInterval = setInterval(() => {
    currentVerb.value = getRandomVerb()
  }, 2000)
})

onBeforeUnmount(() => {
  if (verbInterval) clearInterval(verbInterval)
})
</script>

<style scoped>
.skeleton-haiku {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
