<script setup lang="ts">
// Page: ProfilePage
// The full Edit Profile screen.
// Shows a back arrow header + the ProfileForm organism below it.
// Accessible via the /profile route.

import { useRouter } from 'vue-router'
import ProfileForm from '../components/organisms/ProfileForm.vue'

const router = useRouter()

// Takes the user back to whatever page they came from
function goBack() {
  router.back()
}
</script>

<template>
  <main class="profile-page">
    <!-- Header with back button and page title -->
    <header class="profile-page__header">
      <button class="profile-page__back-btn" aria-label="Go back" @click="goBack">‹</button>
      <h1 class="profile-page__title">Edit Profile</h1>
      <!-- Empty div keeps the title visually centred using flexbox space-between -->
      <div class="profile-page__spacer" aria-hidden="true"></div>
    </header>

    <!-- Main form content -->
    <ProfileForm />
  </main>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: var(--color-page-bg);
  display: flex;
  flex-direction: column;
}

.profile-page__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background-color: var(--color-page-bg);
}

.profile-page__back-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--color-text-primary);
  padding: 0 8px;
  line-height: 1;
}

.profile-page__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.profile-page__spacer {
  width: 40px; /* matches back button width to balance the header */
}
</style>
