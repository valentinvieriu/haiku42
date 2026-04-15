<template>
  <transition name="fade">
    <div v-if="visible && displayText" class="mt-6 max-w-lg mx-auto">
      <div class="flex items-center gap-2 mb-2">
        <span class="thinking-dots text-gray-400">...</span>
        <span class="text-xs text-gray-400 italic uppercase tracking-wider">thinking</span>
      </div>
      <div
        ref="scrollContainer"
        class="max-h-80 overflow-y-auto text-sm text-gray-500 font-mono leading-relaxed px-4 py-3 bg-gray-50 rounded border border-gray-200 whitespace-pre-wrap"
      >
        {{ cleanText }}
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

function stripMarkdown(text) {
  return text
    .replace(/#{1,6}\s*/g, '')          // ### headers
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')      // *italic*
    .replace(/`([^`]+)`/g, '$1')        // `code`
    .replace(/^[-*]\s+/gm, '• ')        // bullet lists
    .replace(/\n{3,}/g, '\n\n')         // collapse excess newlines
}

const displayText = computed(() => {
  if (props.text.length <= 1500) return props.text
  return '...' + props.text.slice(-1500)
})

const cleanText = computed(() => {
  return stripMarkdown(displayText.value)
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
