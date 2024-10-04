<template>
    <div 
      id="zoom_bg" 
      class="relative w-full h-screen cursor-pointer"
      @click="$emit('loadNew')"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-white to-gray-300"></div>
      <transition name="fade" mode="out-in">
        <img
          v-if="isClient && imageUrl && !loading && isLoaded"
          :key="imageUrl"
          :src="imageUrl"
          alt="Background"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
        />
      </transition>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['imageUrl', 'loading'])
defineEmits(['loadNew'])

const isClient = ref(false)
const isLoaded = ref(false)

onMounted(() => {
  isClient.value = true
})

watch(() => props.imageUrl, (newUrl) => {
  if (newUrl) {
    isLoaded.value = false
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>