<script setup>
import { useRouter } from 'vue-router'
import { useHaiku } from '~/composables/useHaiku'

const router = useRouter()
const { generateNewHaiku } = useHaiku()

const generateAndRedirect = async () => {
  try {
    const id = await generateNewHaiku()
    if (id) {
      await router.push({ path: `/haiku/${id}` })
    } else {
      throw new Error('No haiku ID returned')
    }
  } catch (error) {
    console.error('Failed to generate new haiku:', error)
    // Handle the error, show an error message to the user
  }
}

// Use onMounted to ensure this runs on the client-side
onMounted(() => {
  generateAndRedirect()
})
</script>

<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <p class="text-xl text-gray-600">Generating a new haiku...</p>
  </div>
</template>