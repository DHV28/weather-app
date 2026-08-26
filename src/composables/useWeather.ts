// useWeather.ts
// Composable that any component can use to fetch and read weather data.

import { weatherState, weatherActions } from '../store/weatherState'
import { getCurrentWeather, getForecast, getWeatherByCoords } from '../services/weather.api'
import { WeatherUnit } from '../types/weather.types'
import type { CityCard } from '../types/weather.types'

export function useWeather() {

  // Converts a Unix timestamp + timezone offset into a readable local time string
  // e.g. "7:30 PM" — used on the city cards
  function formatLocalTime(dt: number, timezoneOffset: number): string {
    const localMs = (dt + timezoneOffset) * 1000
    const date = new Date(localMs)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC', 
    })
  }

  // Search for a city and add it to the weather list
  async function searchCity(city: string) {
    weatherActions.setLoading(true)
    weatherActions.setError(null)

    const { data, error } = await getCurrentWeather(city, WeatherUnit.Metric)

    if (error || !data) {
      weatherActions.setError(error ?? 'City not found')
      weatherActions.setLoading(false)
      return
    }

    // Build a CityCard from the API response and add it to the list
    const card: CityCard = {
      id: data.id,
      city: data.name,
      country: data.sys.country,
      subtitle: formatLocalTime(data.dt, data.timezone),
      temperature: Math.round(data.main.temp),
      condition: data.weather[0]?.description ?? '',
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
    }

    weatherActions.addCityCard(card)
    weatherActions.addToHistory(city)
    weatherActions.setLoading(false)
  }

  // Fetch weather using GPS coordinates — called on app load for "My Location"
  async function fetchByCoords(lat: number, lon: number) {
    weatherActions.setLoading(true)
    weatherActions.setError(null)

    const { data, error } = await getWeatherByCoords(lat, lon, WeatherUnit.Metric)

    if (error || !data) {
      weatherActions.setError(error ?? 'Could not fetch location weather')
      weatherActions.setLoading(false)
      return
    }

    const card: CityCard = {
      id: data.id,
      city: data.name,
      country: data.sys.country,
      subtitle: data.name, // for "My Location" we show the area name as subtitle
      temperature: Math.round(data.main.temp),
      condition: data.weather[0]?.description ?? '',
      high: Math.round(data.main.temp_max),
      low: Math.round(data.main.temp_min),
      isMyLocation: true,
    }

    // "My Location" always goes at the top of the list
    weatherActions.setMyLocationCard(card)
    weatherActions.setLoading(false)
  }

  // Fetch detail + forecast for a single city (used on the Detail page)
  async function fetchDetail(city: string) {
    weatherActions.setLoading(true)
    weatherActions.setError(null)

    const [weatherRes, forecastRes] = await Promise.all([
      getCurrentWeather(city, WeatherUnit.Metric),
      getForecast(city, WeatherUnit.Metric),
    ])

    if (weatherRes.error || !weatherRes.data) {
      weatherActions.setError(weatherRes.error ?? 'Failed to load weather')
      weatherActions.setLoading(false)
      return
    }

    weatherActions.setCurrentWeather(weatherRes.data)
    weatherActions.setForecast(forecastRes.data?.list ?? [])
    weatherActions.setLoading(false)
  }

  return {
    // Expose state as readonly so components can read but not mutate directly
    weatherState,
    searchCity,
    fetchByCoords,
    fetchDetail,
  }
}
