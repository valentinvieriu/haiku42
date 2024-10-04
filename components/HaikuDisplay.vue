<template>
  <div id="haiku" class="p-4 text-center cursor-pointer" @click="$emit('loadNew')">
    <transition name="fade" mode="out-in">
      <div v-if="loading">
        <SkeletonHaiku />
      </div>
      <div v-else>
        <p v-for="(line, index) in haiku" :key="index" class="haiku-line mb-4">
          <span>{{ typedLines[index] }}</span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import SkeletonHaiku from './SkeletonHaiku.vue'

const props = defineProps(['haiku', 'loading'])
defineEmits(['loadNew'])

const typedLines = ref(['', '', ''])
const animationFrames = ref([])
let isAnimating = false

const typeEffect = (text, lineIndex, speed = 50) => {
  return new Promise((resolve) => {
    let index = 0
    const typeChar = () => {
      if (index < text.length && isAnimating) {
        typedLines.value[lineIndex] += text.charAt(index)
        index++
        animationFrames.value[lineIndex] = requestAnimationFrame(typeChar)
      } else {
        cancelAnimationFrame(animationFrames.value[lineIndex])
        resolve()
      }
    }
    typeChar()
  })
}

const animateHaiku = async () => {
  isAnimating = false
  await new Promise(resolve => setTimeout(resolve, 50)) // Small delay to ensure previous animation stops
  
  isAnimating = true
  animationFrames.value.forEach(frame => cancelAnimationFrame(frame))
  typedLines.value = ['', '', '']

  for (let i = 0; i < props.haiku.length; i++) {
    if (!isAnimating) break
    await typeEffect(props.haiku[i], i)
  }
}

watch(() => props.haiku, () => {
  if (!props.loading) {
    animateHaiku()
  }
}, { immediate: true })

onMounted(() => {
  if (!props.loading) {
    animateHaiku()
  }
})

onBeforeUnmount(() => {
  isAnimating = false
  animationFrames.value.forEach(frame => cancelAnimationFrame(frame))
})
</script>

<style scoped>
.haiku-line {
  @apply font-serif text-gray-800;
}
</style>
