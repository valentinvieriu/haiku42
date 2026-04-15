<template>
  <transition name="fade">
    <div v-if="visible && displayText" class="mt-6 max-w-lg mx-auto">
      <div class="flex items-center gap-2 mb-2">
        <span class="thinking-dots text-gray-400">...</span>
        <span class="text-xs text-gray-400 italic uppercase tracking-wider">thinking</span>
      </div>
      <div
        ref="scrollContainer"
        class="max-h-40 overflow-y-auto text-xs text-gray-400 font-mono leading-relaxed px-3 py-2 bg-gray-50 rounded border border-gray-200"
      >
        {{ displayText }}
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'

const props = defineProps({
  text: { type: String, default: '' },
  visible: { type: Boolean, default: false },
})

const scrollContainer = ref(null)

const displayText = computed(() => {
  if (props.text.length <= 500) return props.text
  return '...' + props.text.slice(-500)
})

watch(() => props.text, async () => {
  await nextTick()
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.thinking-dots {
  animation: blink 1.4s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>
