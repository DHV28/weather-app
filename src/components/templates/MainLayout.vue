<script setup lang="ts">
// Template: MainLayout
// The outermost shell that every page in the app lives inside.
//
// In Atomic Design, Templates sit between Organisms and Pages.
// They define the page structure (slots, max-width, centering) so that
// individual Pages only need to worry about their own content — not the chrome.
//
// Usage:
//   <MainLayout>
//     <RouterView />      ← in App.vue
//   </MainLayout>
//
//   <MainLayout>
//     <SomePageContent /> ← in a Page component
//   </MainLayout>
//
// The max-width keeps the app at a mobile phone width (430px) on desktop,
// matching the Figma designs which are phone-sized.
</script>

<template>
  <!-- Outer wrapper fills the whole viewport and centres the app column -->
  <div class="main-layout">
    <!-- Inner column: caps width at 430px, fills full height -->
    <div class="main-layout__content">
      <!-- slot renders whichever page component is currently active -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Fills the full browser viewport, centres the content column */
.main-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background: #f0f2f8;
}

/* The phone-sized content column — pages render inside here */
.main-layout__content {
  width: 100%;
  max-width: 430px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}
</style>
