// WeatherCard.test.ts
// Component tests for the WeatherCard molecule.
// We check that city name, temperature, condition, and the My Location label render correctly.

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import WeatherCard from '../components/molecules/WeatherCard.vue'

// Shared props used across tests
const baseProps = {
  city: 'London',
  subtitle: '10:30 AM',
  temperature: 9,
  condition: 'clear sky',
  high: 12,
  low: 4,
}

describe('WeatherCard', () => {
  it('displays the city name', () => {
    const wrapper = mount(WeatherCard, { props: baseProps })
    expect(wrapper.find('.weather-card__city').text()).toBe('London')
  })

  it('displays the temperature', () => {
    const wrapper = mount(WeatherCard, { props: baseProps })
    expect(wrapper.find('.weather-card__temp').text()).toBe('9°')
  })

  it('displays the weather condition', () => {
    const wrapper = mount(WeatherCard, { props: baseProps })
    expect(wrapper.find('.weather-card__condition').text()).toBe('clear sky')
  })

  it('displays high and low temperatures', () => {
    const wrapper = mount(WeatherCard, { props: baseProps })
    expect(wrapper.find('.weather-card__range').text()).toBe('H:12° L:4°')
  })

  it('shows "My Location" as the city name when isMyLocation is true', () => {
    const wrapper = mount(WeatherCard, {
      props: { ...baseProps, isMyLocation: true },
    })
    expect(wrapper.find('.weather-card__city').text()).toBe('My Location')
  })

  it('shows the actual city name as subtitle when isMyLocation is true', () => {
    const wrapper = mount(WeatherCard, {
      props: { ...baseProps, isMyLocation: true },
    })
    // subtitle should show the city name, not the time
    expect(wrapper.find('.weather-card__subtitle').text()).toBe('London')
  })

  it('emits a select event when clicked', async () => {
    const wrapper = mount(WeatherCard, { props: baseProps })
    await wrapper.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})
