<template>
  <div
    id="haiku"
    class="text-center cursor-pointer"
    @click="$emit('loadNew')"
  >
    <transition name="fade" mode="out-in">
      <div v-if="loading">
        <SkeletonHaiku />
      </div>
      <div v-else>
        <p
          v-for="(line, index) in haiku"
          :key="index"
          class="haiku-line mb-4"
        >
          <span>{{ typedLines[index] }}</span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import SkeletonHaiku from './SkeletonHaiku.vue'

const props = defineProps(['haiku', 'loading'])
const emit = defineEmits(['loadNew'])

const typedLines = ref(['', '', ''])
const animationFrames = ref([])

const handleLoadNew = () => {
  emit('loadNew')
}

const typeEffect = (text, lineIndex, speed = 42) => {
  if (import.meta.client) {
    return new Promise((resolve) => {
      let index = 0
      let lastTime = performance.now()

      const typeChar = (currentTime) => {
        if (index < text.length) {
          if (currentTime - lastTime >= speed) {
            typedLines.value[lineIndex] += text.charAt(index)
            index++
            lastTime = currentTime
          }
          animationFrames.value[lineIndex] = requestAnimationFrame(typeChar)
        } else {
          cancelAnimationFrame(animationFrames.value[lineIndex])
          resolve()
        }
      }
      animationFrames.value[lineIndex] = requestAnimationFrame(typeChar)
    })
  } else {
    // Server-side fallback: instantly set the full line
    typedLines.value[lineIndex] = text
    return Promise.resolve()
  }
}

const animateHaiku = async () => {
  if (import.meta.client) {
    // Cancel any ongoing animations
    animationFrames.value.forEach((frame) => {
      cancelAnimationFrame(frame)
    })
    typedLines.value = ['', '', ''] // Reset typed lines

    for (let i = 0; i < props.haiku.length; i++) {
      await typeEffect(props.haiku[i], i)
    }
  } else {
    // Server-side fallback: instantly set all lines
    typedLines.value = [...props.haiku]
  }
}

watch(
  () => props.haiku,
  () => {
    if (!props.loading) {
      animateHaiku()
    }
  },
  { immediate: true }
)

onNuxtReady(() => {
  if (!props.loading) {
    animateHaiku()
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    // Clean up animation frames
    animationFrames.value.forEach((frame) => {
      cancelAnimationFrame(frame)
    })
  }
})
</script>

<style scoped>
.haiku-display {
  @apply font-serif text-gray-800;
}
.haiku-line {
  @apply mb-4;
}
</style>
