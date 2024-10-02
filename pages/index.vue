<template>
  <div class="h-screen overflow-hidden">
    <div 
      id="zoom_bg" 
      :class="{ loading }"
      class="h-3/5 w-full fixed top-0 left-0 bg-no-repeat bg-cover bg-center overflow-hidden"
      @click="loadNewHaiku"
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
          @loadNew="loadNewHaiku"
          class="text-2xl md:text-4xl"
        />
        <p v-else>Loading haiku...</p>
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useHaikuStore } from '~/stores/haiku';
import HaikuDisplay from '~/components/HaikuDisplay.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const haikuStore = useHaikuStore();
const haiku = ref(null);
const loading = ref(false);
const backgroundUrl = ref('');
const haikuKey = ref(0);

const loadNewHaiku = async () => {
  loading.value = true;
  backgroundUrl.value = '';
  try {
    await haikuStore.fetchHaiku();
    haiku.value = haikuStore.haiku;
    haikuKey.value++;
    updateUrl();
    await updateBackground();
  } catch (error) {
    console.error('Error loading new haiku:', error);
  } finally {
    loading.value = false;
  }
};

const updateUrl = () => {
  if (haiku.value) {
    const haikuString = JSON.stringify(haiku.value);
    const haikuId = btoa(haikuString);
    router.push({ hash: `#${haikuId}` }); // Use router.push instead of history.pushState
  }
};

const updateBackground = async () => {
  if (!haiku.value) return;

  try {
    const response = await fetch('/api/haiku-image', {
      method: 'POST',
      body: JSON.stringify({ haiku: haiku.value }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    backgroundUrl.value = URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching haiku image:', error);
    backgroundUrl.value = '/default-background.jpg';
  }
};

const loadHaikuFromUrl = async () => {
  const haikuId = window.location.hash.slice(1);
  if (haikuId) {
    try {
      const haikuString = atob(haikuId);
      haiku.value = JSON.parse(haikuString);
      await updateBackground();
    } catch (error) {
      console.error('Failed to load haiku from URL:', error);
      await loadNewHaiku();
    }
  } else {
    await loadNewHaiku();
  }
};

onMounted(async () => {
  await loadHaikuFromUrl();
});

// Watch for route changes
watch(() => router.currentRoute.value.hash, async (newHash) => {
  if (newHash) {
    await loadHaikuFromUrl();
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