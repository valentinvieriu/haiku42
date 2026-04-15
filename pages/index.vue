<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getRandomVerb } from '~/utils/funVerbs'

const router = useRouter()

const generationError = ref(null)
const currentVerb = ref('Generating')

let verbInterval = null

const generateNewHaiku = async () => {
  try {
    const data = await $fetch('/api/haiku', { method: 'POST' })
    if (data && data.id) {
      await router.push({ path: `/haiku/${data.id}` })
    } else {
      throw new Error('Failed to generate new haiku')
    }
  } catch (err) {
    console.error('Failed to generate new haiku:', err)
    generationError.value = err.message || 'An unexpected error occurred'
  }
}

const generateAndRedirect = async () => {
  generationError.value = null
  currentVerb.value = 'Generating'
  await generateNewHaiku()
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
    </div>
    <div v-else class="text-center">
      <p class="text-xl text-red-600 mb-4">{{ generationError }}</p>
      <button @click="generateAndRedirect" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>
  </div>
</template>
