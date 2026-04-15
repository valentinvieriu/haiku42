<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getRandomVerb } from '~/utils/funVerbs'
import ThinkingDisplay from '~/components/ThinkingDisplay.vue'

const router = useRouter()

const generationError = ref(null)
const currentVerb = ref('Generating')
const thinkingText = ref('')
const isThinking = ref(false)

let verbInterval = null

const generateWithStream = () => {
  return new Promise((resolve, reject) => {
    const evtSource = new EventSource('/api/haiku-stream')
    let stallTimer = null
    let settled = false

    const resetStallTimer = () => {
      clearTimeout(stallTimer)
      stallTimer = setTimeout(() => {
        if (settled) return
        settled = true
        console.warn('SSE stalled, falling back to POST')
        evtSource.close()
        fallbackGenerate().then(resolve).catch(reject)
      }, 120000)
    }

    resetStallTimer()

    evtSource.onmessage = async (event) => {
      resetStallTimer()

      let data
      try {
        data = JSON.parse(event.data)
      } catch {
        return
      }

      switch (data.type) {
        case 'thinking':
          isThinking.value = true
          thinkingText.value += data.text
          break
        case 'content':
          break
        case 'complete':
          if (settled) return
          settled = true
          clearTimeout(stallTimer)
          evtSource.close()
          if (data.id) {
            await router.push({ path: `/haiku/${data.id}` })
          }
          resolve()
          break
        case 'error':
          if (settled) return
          settled = true
          clearTimeout(stallTimer)
          evtSource.close()
          reject(new Error(data.message))
          break
      }
    }

    evtSource.onerror = () => {
      if (settled) return
      settled = true
      clearTimeout(stallTimer)
      evtSource.close()
      console.warn('SSE error, falling back to POST')
      fallbackGenerate().then(resolve).catch(reject)
    }
  })
}

const fallbackGenerate = async () => {
  const data = await $fetch('/api/haiku', { method: 'POST' })
  if (data?.id) {
    await router.push({ path: `/haiku/${data.id}` })
  } else {
    throw new Error('Failed to generate new haiku')
  }
}

const generateAndRedirect = async () => {
  generationError.value = null
  currentVerb.value = 'Generating'
  thinkingText.value = ''
  isThinking.value = false

  try {
    await generateWithStream()
  } catch (err) {
    console.error('Failed to generate new haiku:', err)
    generationError.value = err.message || 'An unexpected error occurred'
  }
}

onMounted(() => {
  verbInterval = setInterval(() => { currentVerb.value = getRandomVerb() }, 2000)
  generateAndRedirect()
})

onBeforeUnmount(() => {
  if (verbInterval) clearInterval(verbInterval)
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <div v-if="!generationError" class="text-center">
      <p class="text-xl text-gray-600 transition-opacity duration-300">
        {{ currentVerb }} a new haiku...
      </p>
      <ThinkingDisplay
        :text="thinkingText"
        :visible="isThinking"
      />
    </div>
    <div v-else class="text-center">
      <p class="text-xl text-red-600 mb-4">{{ generationError }}</p>
      <button @click="generateAndRedirect" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>
  </div>
</template>
