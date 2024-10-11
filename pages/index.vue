<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

// Local state
const generationError = ref(null)

// Generate New Haiku
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

// Handle Generate and Redirect
const generateAndRedirect = async () => {
  await generateNewHaiku()
}

// Use onMounted to ensure this runs on the client-side
onMounted(() => {
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