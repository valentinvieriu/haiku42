<template>
    <div 
      id="zoom_bg" 
      class="relative w-full h-screen cursor-pointer"
      @click="$emit('loadNew')"
    >
      <transition name="fade" mode="out-in">
        <img
          v-if="isClient && imageUrl && !loading"
          :key="imageUrl"
          :src="imageUrl"
          alt="Background"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
        <div v-else key="loading" class="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div class="loader"></div>
        </div>
      </transition>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['imageUrl', 'loading'])
defineEmits(['loadNew'])

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

const isLoaded = ref(false)

watch(() => props.imageUrl, (newUrl) => {
  if (newUrl) {
    const img = new Image()
    img.onload = () => {
      isLoaded.value = true
    }
    img.src = newUrl
  } else {
    isLoaded.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3; /* Example border */
  border-top-color: #3498db; /* Example color */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>