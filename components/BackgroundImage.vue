<template>
    <div 
      id="zoom_bg" 
      class="fixed top-0 left-0 w-full h-screen cursor-pointer overflow-hidden"
      @click="handleClick"
      @keydown.enter="handleClick"
      tabindex="0"
      role="button"
      aria-label="Load new background image"
    >
      <div class="absolute inset-0 bg-gradient-to-b from-white to-gray-300"></div>
      <transition name="fade" mode="out-in">
        <img
          v-if="imageUrl"
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
const props = defineProps(['imageUrl'])
const emit = defineEmits(['loadNew'])

const isLoaded = ref(false)
const animationDirection = ref('')

const animationClass = computed(() => {
  return `animate-${animationDirection.value}`
})

onMounted(() => {
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

const handleClick = () => {
  emit('loadNew')
}
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
  0% { transform: scale(1.1); }
  100% { transform: scale(1.25); }
}

@keyframes zoomOut {
  0% { transform: scale(1.25); }
  100% { transform: scale(1.1); }
}

@keyframes panTop {
  0% { transform: scale(1.1) translateY(0); }
  100% { transform: scale(1.1) translateY(-5%); }
}

@keyframes panBottom {
  0% { transform: scale(1.1) translateY(-5%); }
  100% { transform: scale(1.1) translateY(0); }
}

@keyframes panLeft {
  0% { transform: scale(1.1) translateX(0); }
  100% { transform: scale(1.1) translateX(-5%); }
}

@keyframes panRight {
  0% { transform: scale(1.1) translateX(-5%); }
  100% { transform: scale(1.1) translateX(0); }
}

.animate-zoom-in,
.animate-zoom-out,
.animate-pan-top,
.animate-pan-bottom,
.animate-pan-left,
.animate-pan-right {
  animation: 20s ease-in-out infinite alternate;
}

.animate-zoom-in { animation-name: zoomIn; }
.animate-zoom-out { animation-name: zoomOut; }
.animate-pan-top { animation-name: panTop; }
.animate-pan-bottom { animation-name: panBottom; }
.animate-pan-left { animation-name: panLeft; }
.animate-pan-right { animation-name: panRight; }
</style>