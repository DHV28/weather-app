<script setup lang="ts">
// Page: HomePage
// On mount: requests Geolocation to fetch "My Location" weather.
// User can search for cities using the search bar — results are added to the list.

import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWeather } from '../composables/useWeather'
import { useGeolocation } from '../composables/useGeolocation'
import SearchBar from '../components/atoms/SearchBar.vue'
import WeatherList from '../components/organisms/WeatherList.vue'

const router = useRouter()
const searchQuery = ref('')
const { weatherState, fetchByCoords } = useWeather()
const { getCurrentPosition } = useGeolocation()

// Pull the city cards list from global state
const cities = computed(() => weatherState.cityCards)

// On page load, ask the browser for the user's GPS location via our composable.
// If the user denies permission, getCurrentPosition returns null and we do nothing —
// they can still search manually.
onMounted(async () => {
  const position = await getCurrentPosition()
  if (position) {
    fetchByCoords(position.lat, position.lon)
  }
})

function onCitySelected(city: string) {
  router.push({ name: 'Detail', params: { city } })
}

function goToProfile() {
  router.push({ name: 'Profile' })
}

function goToSearch() {
  router.push({ name: 'Search' })
}
</script>

<template>
  <main class="home-page">
    <header class="home-page__header">
      <h1 class="home-page__title">Weather</h1>
      <button class="home-page__profile-btn" aria-label="Go to profile" @click="goToProfile">
        <FontAwesomeIcon :icon="['fas', 'user']" />
      </button>
    </header>

    <!-- Tapping the search bar navigates to the dedicated Search page -->
    <div class="home-page__search" role="button" tabindex="0" @click="goToSearch" @keyup.enter="goToSearch">
      <SearchBar v-model="searchQuery" />
    </div>

    <!-- Loading state -->
    <p v-if="weatherState.loading" class="home-page__status">Loading...</p>

    <!-- Error message if API call failed -->
    <p v-else-if="weatherState.error" class="home-page__error">{{ weatherState.error }}</p>

    <!-- Empty state before any city is loaded -->
    <p v-else-if="cities.length === 0" class="home-page__status">
      Search for a city to get started
    </p>

    <!-- City cards list -->
    <WeatherList v-else :cities="cities" @city-selected="onCitySelected" />
  </main>
</template>

<style scoped>
.home-page {
  padding: 24px 16px;
  min-height: 100vh;
  background: #ffffff;
}

.home-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.home-page__title {
  font-size: 32px;
  font-weight: 800;
  color: var(--color-text-primary);
}

.home-page__profile-btn {
  background: none;
  border: none;
  font-size: 22px;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 4px;
}

.home-page__search {
  margin-bottom: 8px;
  cursor: pointer;
}

.home-page__status {
  text-align: center;
  color: var(--color-text-muted);
  margin-top: 40px;
}

.home-page__error {
  text-align: center;
  color: var(--color-error);
  margin-top: 40px;
}
</style>
