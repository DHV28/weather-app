import { reactive, readonly } from 'vue'
import type { WeatherData, ForecastItem } from '../types/weather.types'

// This is our global state for the whole app.
// We use Vue's reactive() so any component that reads from this
// will automatically update when the data changes.
const state = reactive<{
  currentWeather: WeatherData | null
  forecast: ForecastItem[]
  searchHistory: string[]
  loading: boolean
  error: string | null
}>({
  currentWeather: null, // holds weather data for the currently searched city
  forecast: [],         // holds the 5-day forecast list
  searchHistory: [],    // list of cities the user has searched before
  loading: false,       // true while we are waiting for the API response
  error: null,          // holds an error message if the API call fails
})

// These are the only functions allowed to change the state.
// Keeping changes in one place makes it easier to debug.
const actions = {
  setCurrentWeather(data: WeatherData | null) {
    state.currentWeather = data
  },

  setForecast(items: ForecastItem[]) {
    state.forecast = items
  },

  // Adds a city to the top of the search history list.
  // We avoid adding the same city twice (case-insensitive check).
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

  // Resets weather data and clears any error — useful when starting a new search
  clearWeather() {
    state.currentWeather = null
    state.forecast = []
    state.error = null
  },
}

// We export a readonly version of state so components can read it
// but cannot accidentally change it directly — they must use actions.
export const weatherState = readonly(state)
export const weatherActions = actions
