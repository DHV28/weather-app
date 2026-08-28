<script setup lang="ts">
// Organism: HourlyForecast
// 4 cards side by side

import HourlyCard from '../molecules/HourlyCard.vue'
import type { ForecastItem } from '../../types/weather.types'

const props = defineProps<{
  items: readonly ForecastItem[]
  timezoneOffset: number
}>()

function toLocalTime(dt: number, offset: number): string {
  const localMs = (dt + offset) * 1000
  return new Date(localMs).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  })
}

// Take only the first 4 forecast slots (3-hour intervals)
const hourlyItems = props.items.slice(0, 4)
</script>

<template>
  <section class="hourly-forecast">
    <h2 class="hourly-forecast__title">Hourly Forecast</h2>
    <!-- 4 equal-width cards in a single row -->
    <div class="hourly-forecast__row">
      <HourlyCard
        v-for="item in hourlyItems"
        :key="item.dt"
        :icon-code="item.weather[0]?.icon ?? '01d'"
        :temperature="Math.round(item.main.temp)"
        :time="toLocalTime(item.dt, timezoneOffset)"
      />
    </div>
  </section>
</template>

<style scoped>
.hourly-forecast {
  padding: 24px 16px 8px;
}

.hourly-forecast__title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

.hourly-forecast__row {
  display: flex;
  gap: 8px;
}
</style>
