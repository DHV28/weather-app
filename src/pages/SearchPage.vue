<script setup lang="ts">
// Page: SearchPage
// Full-screen search with live city suggestions as the user types.
// Selecting a suggestion navigates to the Detail page for that city.

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { searchCities } from '../services/weather.api'
import type { GeocodingResult } from '../types/weather.types'
import SearchSuggestionItem from '../components/molecules/SearchSuggestionItem.vue'

const router = useRouter()
const query = ref('')
const suggestions = ref<GeocodingResult[]>([])
const inputError = ref('')  // shown below the search bar when input is too short
let debounceTimer: ReturnType<typeof setTimeout>

// Watch the query and fetch suggestions after user stops typing for 300ms (debounce).
// If the query is too short we clear suggestions and show an inline error message.
watch(query, (val) => {
  clearTimeout(debounceTimer)

  // Nothing typed yet — clear everything silently
  if (!val.trim()) {
    suggestions.value = []
    inputError.value = ''
    return
  }

  // Too short — clear suggestions and show a visible hint
  if (val.trim().length < 2) {
    suggestions.value = []
    inputError.value = 'Please enter at least 2 characters.'
    return
  }

  // Valid length — clear any previous error and fetch suggestions
  inputError.value = ''
  debounceTimer = setTimeout(async () => {
    const { data } = await searchCities(val.trim())
    suggestions.value = data ?? []
  }, 300)
})

// Maps ISO country codes to full country names for readable display
const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States', GB: 'United Kingdom', AU: 'Australia', CA: 'Canada',
  DE: 'Germany', FR: 'France', IT: 'Italy', ES: 'Spain', JP: 'Japan',
  CN: 'China', IN: 'India', BR: 'Brazil', MX: 'Mexico', KR: 'South Korea',
  MY: 'Malaysia', SG: 'Singapore', TH: 'Thailand', ID: 'Indonesia',
  PH: 'Philippines', VN: 'Vietnam', NL: 'Netherlands', SE: 'Sweden',
  NO: 'Norway', DK: 'Denmark', FI: 'Finland', CH: 'Switzerland',
  AT: 'Austria', BE: 'Belgium', PT: 'Portugal', PL: 'Poland', RU: 'Russia',
  ZA: 'South Africa', NG: 'Nigeria', EG: 'Egypt', AR: 'Argentina', CL: 'Chile',
  NZ: 'New Zealand', AE: 'UAE', SA: 'Saudi Arabia', TR: 'Turkey', GR: 'Greece',
}

// Build a readable region string e.g. "Italy" or "TN, United States"
// We use the state only if it's short (state codes like "TN", "IL")
// to avoid repeating long official names like "Special Capital Region of Jakarta"
function formatRegion(result: GeocodingResult): string {
  const countryName = COUNTRY_NAMES[result.country] ?? result.country
  const stateCode = result.state && result.state.length <= 3 ? result.state : null
  return stateCode ? `${stateCode} ${countryName}` : countryName
}

// Use the user's typed query as the display city name
// because the API sometimes returns long official names (e.g. "Special capital Region of Jakarta")
function getDisplayName(result: GeocodingResult): string {
  return result.name.length > 20
    ? query.value.trim()
    : result.name
}

// Navigate to detail page with exact coordinates so the right city loads
// e.g. "Milan, IL" and "Milan, Italy" have different lat/lon
function onSelect(result: GeocodingResult) {
  router.push({
    name: 'Detail',
    params: { city: result.name },
    // Pass the display name so DetailPage can save "Jakarta" not "Penecongan"
    query: { lat: result.lat, lon: result.lon, displayName: getDisplayName(result) },
  })
}

function clearSearch() {
  query.value = ''
  suggestions.value = []
}

function goBack() {
  router.back()
}
</script>

<template>
  <main class="search-page">
    <!-- Search bar row with clear (x) button -->
    <div class="search-page__bar">
      <FontAwesomeIcon :icon="['fas', 'magnifying-glass']" class="search-page__icon" />
      <input
        ref="inputRef"
        v-model="query"
        class="search-page__input"
        type="text"
        placeholder="Search for a city or airport"
        autofocus
        aria-label="Search cities"
        aria-autocomplete="list"
      />
      <!-- X button clears the query; if empty it goes back -->
      <button
        class="search-page__clear-btn"
        aria-label="Clear search"
        @click="query ? clearSearch() : goBack()"
      >
        <FontAwesomeIcon :icon="['fas', 'circle-xmark']" />
      </button>
    </div>

    <!-- Inline error — only visible when the query is too short -->
    <p v-if="inputError" class="search-page__error" role="alert">{{ inputError }}</p>

    <!-- Suggestion list -->
    <ul
      v-if="suggestions.length > 0"
      class="search-page__suggestions"
      role="listbox"
      aria-label="City suggestions"
    >
      <SearchSuggestionItem
        v-for="result in suggestions"
        :key="`${result.lat}-${result.lon}`"
        :city="getDisplayName(result)"
        :region="formatRegion(result)"
        @select="onSelect(result)"
      />
    </ul>
  </main>
</template>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #ffffff;
  padding: 16px 20px;
}

.search-page__bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f2f5;
  border-radius: 50px;
  padding: 12px 18px;
  margin-bottom: 8px;
}

.search-page__icon {
  color: #8a8a9a;
  font-size: 14px;
  flex-shrink: 0;
}

.search-page__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--color-text-primary);
  outline: none;
}

.search-page__clear-btn {
  background: none;
  border: none;
  color: #8a8a9a;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.search-page__suggestions {
  padding: 8px 0;
  margin: 0;
}

.search-page__error {
  font-size: 13px;
  color: var(--color-error);
  padding: 6px 4px 0;
}
</style>
