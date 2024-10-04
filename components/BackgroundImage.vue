<template>
    <div 
      id="zoom_bg" 
      class="relative w-full h-screen cursor-pointer"
      @click="$emit('loadNew')"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-white to-gray-300"></div>
      <transition name="fade" mode="out-in">
        <img
          v-if="isClient && imageUrl && !loading"
          :key="imageUrl"
          :src="imageUrl"
          @load="onImageLoad"
          alt="Background"
          :class="[
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000',
            { 'opacity-0': !isLoaded }
          ]"
        />
      </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps(['imageUrl', 'loading'])
defineEmits(['loadNew'])

const isClient = ref(false)
const isLoaded = ref(false)

onMounted(() => {
  isClient.value = true
})

const onImageLoad = () => {
  isLoaded.value = true
}

// Reset isLoaded when imageUrl changes
watch(() => props.imageUrl, () => {
  isLoaded.value = false
})
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