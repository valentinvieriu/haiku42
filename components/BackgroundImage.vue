<template>
    <div 
      id="zoom_bg" 
      :class="{ loading }" 
      class="relative w-full h-60 cursor-pointer"
      @click="$emit('loadNew')"
    >
      <div 
        v-if="imageUrl" 
        class="bg-cover bg-center opacity-0 transition-opacity duration-1000 absolute inset-0"
        :style="{ backgroundImage: `url('${imageUrl}')` }"
        ref="bgImage"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const props = defineProps(['imageUrl', 'loading'])
  const emit = defineEmits(['loadNew'])
  
  const bgImage = ref(null)
  
  watch(() => props.imageUrl, (newUrl) => {
    if (newUrl && bgImage.value) {
      const img = new Image()
      img.onload = () => {
        bgImage.value.classList.add('opacity-100')
      }
      img.src = newUrl
    }
  })
  </script>