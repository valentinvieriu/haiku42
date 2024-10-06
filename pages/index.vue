<script setup>
import { useRouter } from 'vue-router'
import { useHaikuStore } from '~/stores/haiku'

const router = useRouter()
const haikuStore = useHaikuStore()

onMounted(async () => {
  const id = await haikuStore.generateNewHaiku()
  if (id) {
    await router.push({ path: `/haiku/${id}` })
  }
})
</script>

<template>
  <div class="flex items-center justify-center h-full">
    <p>Loading...</p>
  </div>
</template>