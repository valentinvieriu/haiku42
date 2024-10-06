<script setup>
import { useRouter } from 'vue-router'
import { useHaiku } from '~/composables/useHaiku'
import { ref } from 'vue'

const router = useRouter()
const { generateNewHaiku, error } = useHaiku()
const generationError = ref(null)

const generateAndRedirect = async () => {
  try {
    const id = await generateNewHaiku()
    if (id) {
      await router.push({ path: `/haiku/${id}` })
    } else {
      throw new Error('Failed to generate new haiku')
    }
  } catch (err) {
    console.error('Failed to generate new haiku:', err)
    generationError.value = error.value || 'An unexpected error occurred'
  }
}

// Use onMounted to ensure this runs on the client-side
onNuxtReady(() => {
  generateAndRedirect()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100">
    <p v-if="!generationError" class="text-xl text-gray-600">Generating a new haiku...</p>
    <div v-else class="text-center">
      <p class="text-xl text-red-600 mb-4">{{ generationError }}</p>
      <button @click="generateAndRedirect" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>
  </div>
</template>