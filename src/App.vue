<script setup lang="ts">
// App.vue is the root component — it's the first thing that loads.
// It wraps everything in MainLayout (our Templates layer) which handles
// the max-width centering and outer shell.
// RouterView then renders whichever Page matches the current URL inside that shell.

import MainLayout from './components/templates/MainLayout.vue'
</script>

<template>
  <MainLayout>
    <RouterView />
  </MainLayout>
</template>
