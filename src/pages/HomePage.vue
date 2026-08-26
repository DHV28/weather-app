<script setup lang="ts">
// Page: HomePage
// The main screen — shows the Weather header, search bar, and list of city cards.
// Static placeholder data is used for now; real API data comes in a later commit.

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchBar from '../components/atoms/SearchBar.vue'
import WeatherList from '../components/organisms/WeatherList.vue'

const router = useRouter()
const searchQuery = ref('')

// Placeholder city data — will be replaced with OpenWeatherMap API data later
const cities = [
  {
    id: 1,
    city: 'Bangsar South',
    subtitle: 'Bangsar South',
    temperature: 24,
    condition: 'Moderate Rain',
    high: 30,
    low: 25,
    isMyLocation: true,
  },
  {
    id: 2,
    city: 'Seongnam-si',
    subtitle: '7:30 PM',
    temperature: 21,
    condition: 'Partly Cloudy',
    high: 29,
    low: 15,
  },
  {
    id: 3,
    city: 'London',
    subtitle: '10:30 AM',
    temperature: 9,
    condition: 'Not as cold tomorrow, with a high of 16°',
    high: 16,
    low: -4,
  },
  {
    id: 4,
    city: 'Milan',
    subtitle: '11:30 AM',
    temperature: 12,
    condition: 'Not as cold tomorrow, with a high of 20°',
    high: 20,
    low: 0,
  },
]

// Navigate to the detail page for the selected city
function onCitySelected(city: string) {
  router.push({ name: 'Detail', params: { city } })
}

// Navigate to the profile page when the person icon is clicked
function goToProfile() {
  router.push({ name: 'Profile' })
}
</script>

<template>
  <main class="home-page">
    <!-- Header: title + profile icon -->
    <header class="home-page__header">
      <h1 class="home-page__title">Weather</h1>
      <button class="home-page__profile-btn" aria-label="Go to profile" @click="goToProfile">
        <FontAwesomeIcon :icon="['fas', 'user']" />
      </button>
    </header>

    <!-- Search bar -->
    <div class="home-page__search">
      <SearchBar v-model="searchQuery" />
    </div>

    <!-- List of city weather cards -->
    <WeatherList :cities="cities" @city-selected="onCitySelected" />
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
}
</style>
