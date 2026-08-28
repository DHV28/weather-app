// weatherState.test.ts
// Unit tests for the global weather store.
// Covers all actions and verifies that localStorage is written correctly.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { weatherState, weatherActions } from '../store/weatherState'
import type { CityCard } from '../types/weather.types'

const mockCard: CityCard = {
  id: 1,
  city: 'Kuala Lumpur',
  country: 'MY',
  lat: 3.14,
  lon: 101.7,
  subtitle: '10:00 AM',
  temperature: 30,
  condition: 'clear sky',
  high: 33,
  low: 27,
}

// Remove all city cards and reset transient state before each test
function resetState() {
  const ids = weatherState.cityCards.map(c => c.id)
  ids.forEach(id => weatherActions.removeCityCard(id))
  weatherActions.setLoading(false)
  weatherActions.setError(null)
  weatherActions.clearWeather()
}

describe('weatherActions — city cards', () => {
  beforeEach(resetState)

  it('addCityCard adds a card to the list', () => {
    weatherActions.addCityCard(mockCard)
    expect(weatherState.cityCards.some(c => c.id === mockCard.id)).toBe(true)
  })

  it('addCityCard does not add a duplicate when the same id already exists', () => {
    weatherActions.addCityCard(mockCard)
    weatherActions.addCityCard(mockCard)
    const count = weatherState.cityCards.filter(c => c.id === mockCard.id).length
    expect(count).toBe(1)
  })

  it('removeCityCard removes a card by id', () => {
    weatherActions.addCityCard(mockCard)
    weatherActions.removeCityCard(mockCard.id)
    expect(weatherState.cityCards.some(c => c.id === mockCard.id)).toBe(false)
  })

  it('removeCityCard is a no-op when the id does not exist', () => {
    weatherActions.addCityCard(mockCard)
    const lengthBefore = weatherState.cityCards.length
    weatherActions.removeCityCard(9999)
    expect(weatherState.cityCards.length).toBe(lengthBefore)
  })

  it('setMyLocationCard inserts the card at index 0', () => {
    const locationCard: CityCard = { ...mockCard, id: 999, isMyLocation: true }
    weatherActions.addCityCard(mockCard)
    weatherActions.setMyLocationCard(locationCard)
    expect(weatherState.cityCards[0].id).toBe(999)
  })

  it('setMyLocationCard replaces an existing My Location card', () => {
    const first: CityCard = { ...mockCard, id: 100, isMyLocation: true }
    const second: CityCard = { ...mockCard, id: 200, isMyLocation: true }
    weatherActions.setMyLocationCard(first)
    weatherActions.setMyLocationCard(second)
    const locationCards = weatherState.cityCards.filter(c => c.isMyLocation)
    expect(locationCards.length).toBe(1)
    expect(locationCards[0].id).toBe(200)
  })
})

describe('weatherActions — loading and error', () => {
  beforeEach(resetState)

  it('setLoading sets loading to true', () => {
    weatherActions.setLoading(true)
    expect(weatherState.loading).toBe(true)
  })

  it('setLoading sets loading to false', () => {
    weatherActions.setLoading(true)
    weatherActions.setLoading(false)
    expect(weatherState.loading).toBe(false)
  })

  it('setError stores an error message', () => {
    weatherActions.setError('City not found')
    expect(weatherState.error).toBe('City not found')
  })

  it('setError accepts null to clear the error', () => {
    weatherActions.setError('Some error')
    weatherActions.setError(null)
    expect(weatherState.error).toBeNull()
  })

  it('clearWeather resets currentWeather, forecast, and error', () => {
    weatherActions.setError('Some error')
    weatherActions.clearWeather()
    expect(weatherState.currentWeather).toBeNull()
    expect(weatherState.forecast).toHaveLength(0)
    expect(weatherState.error).toBeNull()
  })
})

describe('weatherActions — localStorage persistence', () => {
  beforeEach(() => {
    resetState()
    vi.spyOn(localStorage, 'setItem')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('addCityCard writes to localStorage', () => {
    weatherActions.addCityCard(mockCard)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('removeCityCard writes to localStorage', () => {
    weatherActions.addCityCard(mockCard)
    vi.mocked(localStorage.setItem).mockClear()
    weatherActions.removeCityCard(mockCard.id)
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('never persists the My Location card to localStorage', () => {
    const locationCard: CityCard = { ...mockCard, id: 999, isMyLocation: true }
    weatherActions.setMyLocationCard(locationCard)
    const lastCall = vi.mocked(localStorage.setItem).mock.calls.at(-1)
    const saved: CityCard[] = JSON.parse(lastCall![1])
    expect(saved.every(c => !c.isMyLocation)).toBe(true)
  })

  it('addCityCard does not call localStorage.setItem for a duplicate', () => {
    weatherActions.addCityCard(mockCard)
    vi.mocked(localStorage.setItem).mockClear()
    weatherActions.addCityCard(mockCard)
    expect(localStorage.setItem).not.toHaveBeenCalled()
  })
})
