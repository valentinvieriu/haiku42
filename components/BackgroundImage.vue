<template>
    <div 
      id="zoom_bg" 
      :class="{ loading }" 
      class="relative w-full h-60 cursor-pointer"
      @click="$emit('loadNew')"
    >
      <transition name="fade" mode="out-in">
        <div 
          v-if="imageUrl" 
          :key="imageUrl"
          class="bg-cover bg-center absolute inset-0"
          :style="{ backgroundImage: `url('${imageUrl}')` }"
        ></div>
      </transition>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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
</style>