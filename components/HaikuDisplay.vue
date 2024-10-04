<template>
  <div id="haiku" class="p-4 text-center cursor-pointer" @click="$emit('loadNew')">
    <transition name="fade" mode="out-in">
      <div v-if="loading">
        <SkeletonHaiku />
      </div>
      <div v-else>
        <p v-for="(line, index) in haiku" :key="index" class="haiku-line mb-4">{{ line }}</p>
      </div>
    </transition>
  </div>
</template>

<script setup>
import SkeletonHaiku from './SkeletonHaiku.vue'
const props = defineProps(['haiku', 'loading'])
defineEmits(['loadNew'])
</script>

<style scoped>
.haiku-line {
  @apply font-serif text-gray-800;
}
</style>
