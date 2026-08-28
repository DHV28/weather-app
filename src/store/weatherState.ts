import { reactive, readonly } from 'vue'
import type { WeatherData, ForecastItem, CityCard } from '../types/weather.types'

const STORAGE_KEY = 'weather_app_cities'

function loadCityCards(): CityCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CityCard[]) : []
  } catch {
    return []
  }
}

function saveCityCards(cards: CityCard[]) {
  // Never persist the My Location card — it's re-fetched fresh on each session
  const toSave = cards.filter(c => !c.isMyLocation)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
}

// This is our global state for the whole app.
// We use Vue's reactive() so any component that reads from this
// will automatically update when the data changes.
const state = reactive<{
  currentWeather: WeatherData | null
  forecast: ForecastItem[]
  cityCards: CityCard[]
  searchHistory: string[]
  loading: boolean
  error: string | null
}>({
  currentWeather: null,
  forecast: [],
  cityCards: loadCityCards(), // restored from localStorage on startup
  searchHistory: [],
  loading: false,
  error: null,
})

// These are the only functions allowed to change the state.
const actions = {
  setCurrentWeather(data: WeatherData | null) {
    state.currentWeather = data
  },

  setForecast(items: ForecastItem[]) {
    state.forecast = items
  },

  // Puts the "My Location" card at index 0, always at the top
  setMyLocationCard(card: CityCard) {
    const withoutLocation = state.cityCards.filter(c => !c.isMyLocation)
    state.cityCards = [card, ...withoutLocation]
    saveCityCards(state.cityCards)
  },

  // Adds a searched city card — avoids duplicates by city id
  addCityCard(card: CityCard) {
    const exists = state.cityCards.some(c => c.id === card.id)
    if (!exists) {
      state.cityCards.push(card)
      saveCityCards(state.cityCards)
    }
  },

  // Removes a city card by id
  removeCityCard(id: number) {
    state.cityCards = state.cityCards.filter(c => c.id !== id)
    saveCityCards(state.cityCards)
  },

  // Adds a city to the top of the search history, avoiding duplicates
  addToHistory(city: string) {
    const normalised = city.trim().toLowerCase()
    if (!state.searchHistory.includes(normalised)) {
      state.searchHistory.unshift(normalised)
    }
  },

  setLoading(value: boolean) {
    state.loading = value
  },

  setError(message: string | null) {
    state.error = message
  },

  clearWeather() {
    state.currentWeather = null
    state.forecast = []
    state.error = null
  },
}

export const weatherState = readonly(state)
export const weatherActions = actions
