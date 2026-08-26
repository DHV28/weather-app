<script setup lang="ts">
// Organism: WeatherList
// Renders the full scrollable list of WeatherCard components.
// Each card emits a 'select' event which we pass up to the page via 'city-selected'.

import WeatherCard from '../molecules/WeatherCard.vue'

// Shape of each city entry — will be replaced with real API data later
interface CityWeather {
  id: number
  city: string
  subtitle: string
  temperature: number
  condition: string
  high: number
  low: number
  isMyLocation?: boolean
}

defineProps<{
  cities: CityWeather[]
}>()

defineEmits<{
  'city-selected': [city: string]
}>()
</script>

<template>
  <section class="weather-list" aria-label="City weather list">
    <WeatherCard
      v-for="item in cities"
      :key="item.id"
      :city="item.city"
      :subtitle="item.subtitle"
      :temperature="item.temperature"
      :condition="item.condition"
      :high="item.high"
      :low="item.low"
      :is-my-location="item.isMyLocation"
      @select="$emit('city-selected', item.city)"
    />
  </section>
</template>

<style scoped>
.weather-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
}
</style>
