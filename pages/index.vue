<template>
  <div class="h-screen overflow-hidden">
    <div 
      id="zoom_bg" 
      :class="{ loading }"
      class="h-3/5 w-full fixed top-0 left-0 bg-no-repeat bg-cover bg-center overflow-hidden"
      @click="generateNewHaiku"
    >
      <transition name="fade" mode="out-in">
        <div 
          v-if="backgroundUrl" 
          :key="backgroundUrl"
          class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          :style="{ backgroundImage: `url('${backgroundUrl}')` }"
        ></div>
      </transition>
    </div>
    <main class="absolute bottom-[13%] left-0 right-0 p-8 bg-white">
      <transition name="fade" mode="out-in">
        <HaikuDisplay 
          v-if="haiku"
          :key="haikuKey"
          :haiku="[haiku.firstLine, haiku.secondLine, haiku.thirdLine]" 
          @loadNew="generateNewHaiku"
          class="text-2xl md:text-4xl"
        />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useHaikuStore } from '~/stores/haiku';
import HaikuDisplay from '~/components/HaikuDisplay.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const haikuStore = useHaikuStore();
const haiku = ref(null);
const loading = ref(false);
const backgroundUrl = ref('');
const haikuKey = ref(0);

const generateNewHaiku = async () => {
  loading.value = true;
  try {
    const response = await fetch('/api/haiku', { method: 'POST' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { id } = await response.json();
    router.push({ path: `/haiku/${id}` });
  } catch (error) {
    console.error('Error generating new haiku:', error);
    loading.value = false;
  }
};

const loadHaiku = async (id) => {
  loading.value = true;
  try {
    await haikuStore.fetchHaiku(id);
    haiku.value = haikuStore.haiku;
    
    // Preload the new image before updating the backgroundUrl
    const img = new Image();
    img.onload = () => {
      backgroundUrl.value = haiku.value.imageUrl;
      haikuKey.value++;
      loading.value = false;
    };
    img.onerror = () => {
      console.error('Failed to load image');
      loading.value = false;
    };
    img.src = haiku.value.imageUrl;
  } catch (error) {
    console.error('Error loading haiku:', error);
    loading.value = false;
  }
};

onMounted(async () => {
  const haikuId = route.params.id;
  if (haikuId) {
    await loadHaiku(haikuId);
  } else {
    await generateNewHaiku();
  }
});

// Watch for route changes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await loadHaiku(newId);
  }
});
</script>

<style scoped>
#zoom_bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: 30%;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-image: url('/loading.svg');
  animation: pulsate 1.5s ease-in-out infinite;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

#zoom_bg.loading::before {
  opacity: 1;
}

@keyframes pulsate {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>