<script setup>
import { useRouter } from 'vue-router'
import { useHaiku } from '~/composables/useHaiku'

const router = useRouter()
const { generateNewHaiku } = useHaiku()

onMounted(async () => {
  try {
    const id = await generateNewHaiku()
    if (id) {
      await router.push({ path: `/haiku/${id}` })
    } else {
      console.error('No haiku ID returned')
      // Handle the error, maybe show an error message to the user
    }
  } catch (error) {
    console.error('Failed to generate new haiku:', error)
    // Handle the error, maybe show an error message to the user
  }
})
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <p>Loading...</p>
  </div>
</template>