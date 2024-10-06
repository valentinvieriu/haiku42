<template>
  <div class="h-screen overflow-hidden">
    <BackgroundImage
      :image-url="backgroundUrl"
      :loading="imageLoading"
      @loadNew="generateNewHaiku"
    />
    <main class="absolute bottom-[13%] left-0 right-0 p-8 bg-white bg-opacity-95">
      <transition name="fade" mode="out-in">
        <HaikuDisplay 
          v-if="haiku"
          :key="haiku.id"
          :haiku="[haiku.firstLine, haiku.secondLine, haiku.thirdLine]" 
          :loading="haikuLoading"
          @loadNew="generateNewHaiku"
          class="text-2xl md:text-4xl"
        />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { useHaiku } from '~/composables/useHaiku'
import HaikuDisplay from '~/components/HaikuDisplay.vue'
import BackgroundImage from '~/components/BackgroundImage.vue'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const { haiku, haikuLoading, imageLoading, backgroundUrl, fetchHaiku, fetchBackgroundImage, generateNewHaiku } = useHaiku()

const loadHaiku = async (id) => {
  await fetchHaiku(id)
  await fetchBackgroundImage(id)
}

const handleGenerateNewHaiku = async () => {
  const id = await generateNewHaiku()
  if (id) {
    await router.push({ path: `/haiku/${id}` })
  }
}

definePageMeta({
  layout: 'default'
})

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && (!oldId || newId !== oldId)) {
      await loadHaiku(newId)
    } else if (!newId) {
      await handleGenerateNewHaiku()
    }
  },
  { immediate: true }
)
</script>
