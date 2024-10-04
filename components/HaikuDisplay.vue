<template>
  <div
    id="haiku"
    class="p-4 text-center cursor-pointer"
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
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import SkeletonHaiku from './SkeletonHaiku.vue'

const props = defineProps(['haiku', 'loading'])
defineEmits(['loadNew'])

const typedLines = ref(['', '', ''])
const animationFrames = ref([]) // To keep track of animation frames

const typeEffect = (text, lineIndex, speed = 42) => {
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
}

const animateHaiku = async () => {
  // Cancel any ongoing animations
  animationFrames.value.forEach((frame) => {
    cancelAnimationFrame(frame)
  })
  typedLines.value = ['', '', ''] // Reset typed lines

  for (let i = 0; i < props.haiku.length; i++) {
    await typeEffect(props.haiku[i], i)
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

onMounted(() => {
  if (!props.loading) {
    animateHaiku()
  }
})

onBeforeUnmount(() => {
  // Clean up animation frames
  animationFrames.value.forEach((frame) => {
    cancelAnimationFrame(frame)
  })
})
</script>

<style scoped>
.haiku-line {
  @apply font-serif text-gray-800;
}
</style>
