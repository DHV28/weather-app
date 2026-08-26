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
let debounceTimer: ReturnType<typeof setTimeout>

// Watch the query and fetch suggestions after user stops typing for 300ms (debounce)
watch(query, (val) => {
  clearTimeout(debounceTimer)
  if (!val.trim() || val.length < 2) {
    suggestions.value = []
    return
  }
  debounceTimer = setTimeout(async () => {
    const { data } = await searchCities(val.trim())
    suggestions.value = data ?? []
  }, 300)
})

// Build a readable region string e.g. "Italy" or "TN United States"
function formatRegion(result: GeocodingResult): string {
  const parts = []
  if (result.state) parts.push(result.state)
  parts.push(result.country)
  return parts.join(' ')
}

// Navigate to detail page with exact coordinates so the right city loads
// e.g. "Milan, IL" and "Milan, Italy" have different lat/lon
function onSelect(result: GeocodingResult) {
  router.push({
    name: 'Detail',
    params: { city: result.name },
    query: { lat: result.lat, lon: result.lon },
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
        :city="result.name"
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
</style>
