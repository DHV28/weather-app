// useGeolocation.ts
// Composable that wraps the browser's Geolocation Web API.
//
// Instead of calling navigator.geolocation.getCurrentPosition directly in a page,
// any component can call useGeolocation() to get the user's GPS coordinates.
// This keeps pages clean and makes the geolocation logic easy to reuse or test.

import { ref } from 'vue'

// Shape of the coordinates we return — lat/lon as numbers
export interface Coordinates {
  lat: number
  lon: number
}

export function useGeolocation() {
  // null means we haven't tried yet or the user denied permission
  const coords = ref<Coordinates | null>(null)

  // Human-readable error if the browser can't get the location
  const geoError = ref<string | null>(null)

  // True while the browser is still fetching the position
  const geoLoading = ref(false)

  // Ask the browser for the user's current GPS position.
  // On success: fills coords.value with { lat, lon }
  // On failure: fills geoError.value with a reason string
  function getCurrentPosition(): Promise<Coordinates | null> {
    // Geolocation API is not available in all environments (e.g. HTTP, old browsers)
    if (!navigator.geolocation) {
      geoError.value = 'Geolocation is not supported by your browser.'
      return Promise.resolve(null)
    }

    geoLoading.value = true
    geoError.value = null

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        // Success callback — browser gave us coordinates
        (position) => {
          const result: Coordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          }
          coords.value = result
          geoLoading.value = false
          resolve(result)
        },
        // Error callback — user denied or timeout
        (err) => {
          // err.code: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
          if (err.code === 1) {
            geoError.value = 'Location access denied. Search for a city manually.'
          } else {
            geoError.value = 'Could not determine your location.'
          }
          geoLoading.value = false
          resolve(null)
        },
        // Options: give the browser up to 10 seconds before timing out
        { timeout: 10_000 }
      )
    })
  }

  return {
    coords,
    geoError,
    geoLoading,
    getCurrentPosition,
  }
}
