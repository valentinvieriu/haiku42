<template>
  <div class="h-screen overflow-hidden">
    <BackgroundImage
      :image-url="haikuStore.backgroundUrl"
      :loading="haikuStore.imageLoading"
      @loadNew="generateNewHaiku"
    />
    <main class="absolute bottom-[13%] left-0 right-0 p-8 bg-white bg-opacity-95">
      <transition name="fade" mode="out-in">
        <HaikuDisplay 
          v-if="haikuStore.haiku"
          :key="haikuStore.haiku.id"
          :haiku="[haikuStore.haiku.firstLine, haikuStore.haiku.secondLine, haikuStore.haiku.thirdLine]" 
          :loading="haikuStore.haikuLoading"
          @loadNew="generateNewHaiku"
          class="text-2xl md:text-4xl"
        />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { useHaikuStore } from '~/stores/haiku'
import HaikuDisplay from '~/components/HaikuDisplay.vue'
import BackgroundImage from '~/components/BackgroundImage.vue'
import { useRoute, useRouter } from 'vue-router'
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const haikuStore = useHaikuStore()

const generateNewHaiku = async () => {
  const id = await haikuStore.generateNewHaiku()
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
      await haikuStore.fetchHaiku(newId)
      await haikuStore.fetchBackgroundImage(newId)
    } else if (!newId) {
      await generateNewHaiku()
    }
  },
  { immediate: true }
)
</script>
