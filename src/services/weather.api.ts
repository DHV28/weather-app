// weather.api.ts
// All OpenWeatherMap API calls live here.

import type { WeatherData, ForecastResponse, ApiResponse } from '../types/weather.types'
import { WeatherUnit } from '../types/weather.types'

// Read the API key from the .env file (set VITE_OPENWEATHER_API_KEY in .env)
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Shared helper — makes the fetch call and returns typed data or an error message
async function apiFetch<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url)

    // API returns non-200 for bad city names, expired keys, etc.
    if (!response.ok) {
      const errorData = await response.json()
      return { data: null, error: errorData.message ?? 'Something went wrong' }
    }

    const data: T = await response.json()
    return { data, error: null }
  } catch {
    // Network errors (no internet, DNS failure, etc.)
    return { data: null, error: 'Network error — please check your connection' }
  }
}

// Fetch current weather by city name
export async function getCurrentWeather(
  city: string,
  unit: WeatherUnit = WeatherUnit.Metric
): Promise<ApiResponse<WeatherData>> {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`
  return apiFetch<WeatherData>(url)
}

// Fetch current weather by GPS coordinates (used for "My Location")
export async function getWeatherByCoords(
  lat: number,
  lon: number,
  unit: WeatherUnit = WeatherUnit.Metric
): Promise<ApiResponse<WeatherData>> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
  return apiFetch<WeatherData>(url)
}

// Fetch 5-day / 3-hour forecast by city name
export async function getForecast(
  city: string,
  unit: WeatherUnit = WeatherUnit.Metric
): Promise<ApiResponse<ForecastResponse>> {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=${unit}&appid=${API_KEY}`
  return apiFetch<ForecastResponse>(url)
}
