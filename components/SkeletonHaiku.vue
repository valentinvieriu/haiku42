<template>
  <div class="skeleton-haiku">
    <div class="h-6 bg-gray-300 rounded mb-4"></div>
    <div class="h-6 bg-gray-300 rounded mb-4"></div>
    <div class="h-6 bg-gray-300 rounded mb-4"></div>
  </div>
</template>

<script setup>
// No script content needed
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