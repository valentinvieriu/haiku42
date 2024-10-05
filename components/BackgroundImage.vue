<template>
    <div 
      id="zoom_bg" 
      class="relative w-full h-screen cursor-pointer overflow-hidden"
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
            { 'opacity-0': !isLoaded },
            animationClass
          ]"
        />
      </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'

const props = defineProps(['imageUrl', 'loading'])
defineEmits(['loadNew'])

const isClient = ref(false)
const isLoaded = ref(false)
const animationDirection = ref('')

const animationClass = computed(() => {
  return `animate-${animationDirection.value}`
})

onMounted(() => {
  isClient.value = true
  setRandomAnimation()
})

const onImageLoad = () => {
  isLoaded.value = true
}

const setRandomAnimation = () => {
  const animations = ['zoom-in', 'zoom-out', 'pan-top', 'pan-bottom', 'pan-left', 'pan-right']
  animationDirection.value = animations[Math.floor(Math.random() * animations.length)]
}

// Reset isLoaded and set new random animation when imageUrl changes
watch(() => props.imageUrl, () => {
  isLoaded.value = false
  setRandomAnimation()
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

@keyframes zoomIn {
  0% { transform: scale(1); }
  100% { transform: scale(1.15); }
}

@keyframes zoomOut {
  0% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes panTop {
  0% { transform: translateY(0); }
  100% { transform: translateY(-7%); }
}

@keyframes panBottom {
  0% { transform: translateY(-7%); }
  100% { transform: translateY(0); }
}

@keyframes panLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-7%); }
}

@keyframes panRight {
  0% { transform: translateX(-7%); }
  100% { transform: translateX(0); }
}

.animate-zoom-in {
  animation: zoomIn 20s ease-in-out infinite alternate;
}

.animate-zoom-out {
  animation: zoomOut 20s ease-in-out infinite alternate;
}

.animate-pan-top {
  animation: panTop 20s ease-in-out infinite alternate;
}

.animate-pan-bottom {
  animation: panBottom 20s ease-in-out infinite alternate;
}

.animate-pan-left {
  animation: panLeft 20s ease-in-out infinite alternate;
}

.animate-pan-right {
  animation: panRight 20s ease-in-out infinite alternate;
}
</style>