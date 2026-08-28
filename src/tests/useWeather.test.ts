// useWeather.test.ts
// Integration tests for the useWeather composable.
// The weather API module is mocked so no real HTTP requests are made.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useWeather } from '../composables/useWeather'
import { weatherState, weatherActions } from '../store/weatherState'
import type { CityCard } from '../types/weather.types'

// --- Mock the API module ---
vi.mock('../services/weather.api', () => ({
  getCurrentWeather: vi.fn(),
  getForecast: vi.fn(),
  getWeatherByCoords: vi.fn(),
  getForecastByCoords: vi.fn(),
}))

import {
  getCurrentWeather,
  getForecast,
  getWeatherByCoords,
  getForecastByCoords,
} from '../services/weather.api'

// Minimal WeatherData response to satisfy the composable
const mockWeatherData = {
  id: 42,
  name: 'Tokyo',
  dt: 1_700_000_000,
  timezone: 32400,
  coord: { lat: 35.68, lon: 139.69 },
  sys: { country: 'JP', sunrise: 0, sunset: 0 },
  main: { temp: 18, temp_min: 15, temp_max: 21, feels_like: 17, humidity: 60, pressure: 1013 },
  wind: { speed: 5, deg: 180 },
  weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
}

const mockForecastData = {
  city: { name: 'Tokyo', country: 'JP', timezone: 32400 },
  list: [
    {
      dt: 1_700_010_000,
      dt_txt: '2023-11-14 12:00:00',
      main: { temp: 19, temp_min: 16, temp_max: 22, humidity: 55 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 4 },
    },
  ],
}

function resetState() {
  const ids = weatherState.cityCards.map(c => c.id)
  ids.forEach(id => weatherActions.removeCityCard(id))
  weatherActions.clearWeather()
  weatherActions.setLoading(false)
  weatherActions.setError(null)
}

describe('useWeather — searchCity', () => {
  beforeEach(() => {
    resetState()
    vi.mocked(getCurrentWeather).mockResolvedValue({ data: mockWeatherData, error: null })
  })

  it('adds a city card on success', async () => {
    const { searchCity } = useWeather()
    await searchCity('Tokyo')
    expect(weatherState.cityCards.some(c => c.id === mockWeatherData.id)).toBe(true)
  })

  it('sets the error and does not add a card when the API returns an error', async () => {
    vi.mocked(getCurrentWeather).mockResolvedValue({ data: null, error: 'City not found' })
    const { searchCity } = useWeather()
    await searchCity('Nowhere')
    expect(weatherState.error).toBe('City not found')
    expect(weatherState.cityCards.some(c => c.id === mockWeatherData.id)).toBe(false)
  })

  it('sets loading to false after a successful search', async () => {
    const { searchCity } = useWeather()
    await searchCity('Tokyo')
    expect(weatherState.loading).toBe(false)
  })

  it('sets loading to false even when the API returns an error', async () => {
    vi.mocked(getCurrentWeather).mockResolvedValue({ data: null, error: 'City not found' })
    const { searchCity } = useWeather()
    await searchCity('Nowhere')
    expect(weatherState.loading).toBe(false)
  })
})

describe('useWeather — fetchDetail', () => {
  beforeEach(() => {
    resetState()
    vi.mocked(getCurrentWeather).mockResolvedValue({ data: mockWeatherData, error: null })
    vi.mocked(getForecast).mockResolvedValue({ data: mockForecastData, error: null })
  })

  it('sets currentWeather on success', async () => {
    const { fetchDetail } = useWeather()
    await fetchDetail('Tokyo')
    expect(weatherState.currentWeather?.id).toBe(mockWeatherData.id)
  })

  it('sets forecast items on success', async () => {
    const { fetchDetail } = useWeather()
    await fetchDetail('Tokyo')
    expect(weatherState.forecast.length).toBe(1)
  })

  it('sets error when the API fails', async () => {
    vi.mocked(getCurrentWeather).mockResolvedValue({ data: null, error: 'Failed to load weather' })
    const { fetchDetail } = useWeather()
    await fetchDetail('Tokyo')
    expect(weatherState.error).toBe('Failed to load weather')
  })
})

describe('useWeather — fetchDetailByCoords', () => {
  beforeEach(() => {
    resetState()
    vi.mocked(getWeatherByCoords).mockResolvedValue({ data: mockWeatherData, error: null })
    vi.mocked(getForecastByCoords).mockResolvedValue({ data: mockForecastData, error: null })
  })

  it('sets currentWeather using coordinates', async () => {
    const { fetchDetailByCoords } = useWeather()
    await fetchDetailByCoords(35.68, 139.69)
    expect(weatherState.currentWeather?.id).toBe(mockWeatherData.id)
  })

  it('sets forecast using coordinates', async () => {
    const { fetchDetailByCoords } = useWeather()
    await fetchDetailByCoords(35.68, 139.69)
    expect(weatherState.forecast.length).toBe(1)
  })

  it('sets error when the coords API fails', async () => {
    vi.mocked(getWeatherByCoords).mockResolvedValue({ data: null, error: 'Failed to load weather' })
    const { fetchDetailByCoords } = useWeather()
    await fetchDetailByCoords(0, 0)
    expect(weatherState.error).toBe('Failed to load weather')
  })
})

describe('useWeather — addCurrentToList', () => {
  beforeEach(() => {
    resetState()
    // Pre-load currentWeather into state so addCurrentToList has data to work with
    weatherActions.setCurrentWeather(mockWeatherData as Parameters<typeof weatherActions.setCurrentWeather>[0])
  })

  it('adds the currently loaded city to the city cards list', () => {
    const { addCurrentToList } = useWeather()
    addCurrentToList()
    expect(weatherState.cityCards.some(c => c.id === mockWeatherData.id)).toBe(true)
  })

  it('uses the displayName override instead of the API city name when provided', () => {
    const { addCurrentToList } = useWeather()
    addCurrentToList('Shinjuku')
    const card = weatherState.cityCards.find(c => c.id === mockWeatherData.id)
    expect(card?.city).toBe('Shinjuku')
  })

  it('falls back to the API city name when no displayName is given', () => {
    const { addCurrentToList } = useWeather()
    addCurrentToList()
    const card = weatherState.cityCards.find(c => c.id === mockWeatherData.id)
    expect(card?.city).toBe('Tokyo')
  })

  it('does nothing when no current weather is loaded', () => {
    weatherActions.clearWeather()
    const { addCurrentToList } = useWeather()
    const lengthBefore = weatherState.cityCards.length
    addCurrentToList()
    expect(weatherState.cityCards.length).toBe(lengthBefore)
  })
})
