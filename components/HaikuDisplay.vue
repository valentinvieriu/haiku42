<template>
  <div id="haiku" class="p-4 text-center cursor-pointer" @click="$emit('loadNew')">
    <p v-for="(line, index) in haiku" :key="index" class="haiku-line">{{ line }}</p>
  </div>
</template>

<script setup>
const props = defineProps(['haiku'])
defineEmits(['loadNew'])
</script>
