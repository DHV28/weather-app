// All TypeScript types for the weather app in one place.
// These match the shape of data returned by the OpenWeatherMap API.

// Temperature unit constants — 'as const' makes these readonly and fully typed.
// We use this pattern instead of enum because TypeScript's erasableSyntaxOnly
// mode (used by Vite) doesn't allow enums that generate JavaScript code.
export const WeatherUnit = {
  Metric: 'metric',
  Imperial: 'imperial',
} as const

// This creates a type that is either 'metric' or 'imperial'
export type WeatherUnit = typeof WeatherUnit[keyof typeof WeatherUnit]

// Shape of one weather condition object inside the API response
export interface WeatherCondition {
  id: number
  main: string        // e.g. "Rain"
  description: string // e.g. "moderate rain"
  icon: string        // e.g. "10d" — used to build the icon URL
}

// Shape of the current weather API response (/weather endpoint)
export interface WeatherData {
  id: number
  name: string        // city name
  dt: number          // timestamp of the data
  timezone: number    // timezone offset in seconds from UTC
  coord: {
    lat: number
    lon: number
  }
  sys: {
    country: string   // e.g. "MY"
    sunrise: number
    sunset: number
  }
  main: {
    temp: number
    temp_min: number
    temp_max: number
    feels_like: number
    humidity: number
    pressure: number
  }
  wind: {
    speed: number
    deg: number
  }
  weather: readonly WeatherCondition[]
}

// Shape of one entry in the 5-day forecast list (/forecast endpoint)
export interface ForecastItem {
  dt: number
  dt_txt: string      // e.g. "2024-01-20 12:00:00"
  main: {
    temp: number
    temp_min: number
    temp_max: number
    humidity: number
  }
  weather: readonly WeatherCondition[]
  wind: {
    speed: number
  }
}

// Shape of the full forecast API response
export interface ForecastResponse {
  city: {
    name: string
    country: string
    timezone: number
  }
  list: ForecastItem[]
}

// Generic wrapper — used so every API call returns loading/error state consistently
export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

// Shape of one result from the Geocoding API (/geo/1.0/direct)
export interface GeocodingResult {
  name: string      // city name e.g. "Milan"
  country: string   // country code e.g. "IT"
  state?: string    // state/region e.g. "TN" (only for some countries)
  lat: number
  lon: number
}

// What we show on each city card in the list
export interface CityCard {
  id: number
  city: string
  country: string
  lat: number
  lon: number
  subtitle: string   // local time or area description
  temperature: number
  condition: string
  high: number
  low: number
  isMyLocation?: boolean
}
