// useGeolocation.test.ts
// Unit tests for the useGeolocation composable.
// navigator.geolocation is mocked so these tests run without a real browser.

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGeolocation } from '../composables/useGeolocation'

// Helper that installs a mock geolocation implementation on navigator
function mockGeolocation(impl: Partial<Geolocation>) {
  Object.defineProperty(global.navigator, 'geolocation', {
    value: impl,
    writable: true,
    configurable: true,
  })
}

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null and sets an error when the browser does not support geolocation', async () => {
    mockGeolocation(undefined as unknown as Geolocation)

    const { getCurrentPosition, geoError, coords } = useGeolocation()
    const result = await getCurrentPosition()

    expect(result).toBeNull()
    expect(coords.value).toBeNull()
    expect(geoError.value).toBe('Geolocation is not supported by your browser.')
  })

  it('resolves with coordinates and updates reactive state on success', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((success) =>
        success({ coords: { latitude: 3.14, longitude: 101.7 } } as GeolocationPosition),
      ),
    })

    const { getCurrentPosition, coords, geoError, geoLoading } = useGeolocation()
    const result = await getCurrentPosition()

    expect(result).toEqual({ lat: 3.14, lon: 101.7 })
    expect(coords.value).toEqual({ lat: 3.14, lon: 101.7 })
    expect(geoError.value).toBeNull()
    expect(geoLoading.value).toBe(false)
  })

  it('returns null and sets a permission-denied error when the user denies access', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_, error) =>
        error({ code: 1 } as GeolocationPositionError),
      ),
    })

    const { getCurrentPosition, geoError, coords } = useGeolocation()
    const result = await getCurrentPosition()

    expect(result).toBeNull()
    expect(coords.value).toBeNull()
    expect(geoError.value).toBe('Location access denied. Search for a city manually.')
  })

  it('returns null and sets a generic error for position-unavailable failures', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_, error) =>
        error({ code: 2 } as GeolocationPositionError),
      ),
    })

    const { getCurrentPosition, geoError } = useGeolocation()
    const result = await getCurrentPosition()

    expect(result).toBeNull()
    expect(geoError.value).toBe('Could not determine your location.')
  })

  it('resets geoLoading to false after a successful fetch', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((success) =>
        success({ coords: { latitude: 1, longitude: 2 } } as GeolocationPosition),
      ),
    })

    const { getCurrentPosition, geoLoading } = useGeolocation()
    await getCurrentPosition()

    expect(geoLoading.value).toBe(false)
  })

  it('resets geoLoading to false after a failed fetch', async () => {
    mockGeolocation({
      getCurrentPosition: vi.fn((_, error) =>
        error({ code: 1 } as GeolocationPositionError),
      ),
    })

    const { getCurrentPosition, geoLoading } = useGeolocation()
    await getCurrentPosition()

    expect(geoLoading.value).toBe(false)
  })
})
