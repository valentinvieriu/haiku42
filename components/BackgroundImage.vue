<template>
    <div 
      id="zoom_bg" 
      :class="{ loading }" 
      class="relative w-full h-60 md:h-screen cursor-pointer transition-transform duration-500 ease-in-out"
      @click="$emit('loadNew')"
    >
      <transition name="fade" mode="out-in">
        <div 
          v-if="imageUrl" 
          :key="imageUrl"
          class="bg-cover bg-center absolute inset-0 opacity-0 transition-opacity duration-500"
          :class="{ 'opacity-100': !loading }"
          :style="{ backgroundImage: `url('${imageUrl}')` }"
        ></div>
      </transition>
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-gray-200 opacity-75">
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-900 h-12 w-12"></div>
      </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps(['imageUrl', 'loading'])
const emit = defineEmits(['loadNew'])

const bgImage = ref(null)

const loadImage = (url) => {
  if (url && bgImage.value) {
    const img = new Image()
    img.onload = () => {
      bgImage.value.classList.add('opacity-100')
    }
    img.src = url
  }
}

watch(() => props.imageUrl, (newUrl) => {
  loadImage(newUrl)
})

onMounted(() => {
  loadImage(props.imageUrl)
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

.loader {
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>