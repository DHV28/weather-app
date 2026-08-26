<script setup lang="ts">
// Organism: WeeklyForecast
// Shows one row per day for the next 5 days.

import { computed } from 'vue'
import DailyForecastRow from '../molecules/DailyForecastRow.vue'
import type { ForecastItem } from '../../types/weather.types'

const props = defineProps<{
  items: ForecastItem[]
}>()

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Group forecast items by calendar date and take the midday reading for each day
const dailyItems = computed(() => {
  const byDate = new Map<string, ForecastItem>()

  for (const item of props.items) {
    // dt_txt format: "2024-01-20 12:00:00" — we use the date part as the key
    const date = item.dt_txt.split(' ')[0]
    const hour = parseInt(item.dt_txt.split(' ')[1])

    // Prefer the 12:00 reading; fall back to first available for that date
    if (!byDate.has(date) || hour === 12) {
      byDate.set(date, item)
    }
  }

  return Array.from(byDate.entries()).map(([date, item]) => {
    const dayIndex = new Date(date).getDay()
    return {
      dt: item.dt,
      day: DAY_NAMES[dayIndex],
      iconCode: item.weather[0]?.icon ?? '01d',
      // Capitalise first letter e.g. "thunderstorm" → "Thunderstorm"
      condition: (item.weather[0]?.description ?? '').replace(/\b\w/g, c => c.toUpperCase()),
      temperature: Math.round(item.main.temp),
    }
  })
})
</script>

<template>
  <section class="weekly-forecast">
    <h2 class="weekly-forecast__title">Weekly Forecast</h2>
    <div class="weekly-forecast__list">
      <DailyForecastRow
        v-for="item in dailyItems"
        :key="item.dt"
        :icon-code="item.iconCode"
        :day="item.day"
        :condition="item.condition"
        :temperature="item.temperature"
      />
    </div>
  </section>
</template>

<style scoped>
.weekly-forecast {
  padding: 24px 16px;
}

.weekly-forecast__title {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 14px 0;
}

.weekly-forecast__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
