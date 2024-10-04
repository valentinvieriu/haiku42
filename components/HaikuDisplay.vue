<template>
  <div id="haiku" class="p-4 text-center cursor-pointer" @click="$emit('loadNew')">
    <transition name="fade" mode="out-in">
      <div v-if="loading">
        <SkeletonHaiku />
      </div>
      <div v-else>
        <p v-for="(line, index) in haiku" :key="index" class="haiku-line mb-4">
          <span ref="lineRefs">{{ typedLines[index] }}</span>
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import SkeletonHaiku from './SkeletonHaiku.vue'

const props = defineProps(['haiku', 'loading'])
defineEmits(['loadNew'])

const typedLines = ref(['', '', ''])
const lineRefs = ref([])

const typeEffect = (text, lineIndex, speed = 50) => {
  return new Promise((resolve) => {
    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        typedLines.value[lineIndex] += text[index]
        index++
      } else {
        clearInterval(timer)
        resolve()
      }
    }, speed)
  })
}

const animateHaiku = async () => {
  for (let i = 0; i < props.haiku.length; i++) {
    await typeEffect(props.haiku[i], i)
  }
}

watch(() => props.haiku, () => {
  typedLines.value = ['', '', '']
  if (!props.loading) {
    animateHaiku()
  }
}, { immediate: true })

onMounted(() => {
  if (!props.loading) {
    animateHaiku()
  }
})
</script>

<style scoped>
.haiku-line {
  @apply font-serif text-gray-800;
}
</style>
