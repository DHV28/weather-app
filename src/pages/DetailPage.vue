<script setup lang="ts">
// Page: DetailPage
// Full weather detail for a selected city.

import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWeather } from '../composables/useWeather'
import HourlyForecast from '../components/organisms/HourlyForecast.vue'
import WeeklyForecast from '../components/organisms/WeeklyForecast.vue'

const props = defineProps<{ city: string }>()
const router = useRouter()
const { weatherState, fetchDetail } = useWeather()

onMounted(() => fetchDetail(props.city))

const weather = computed(() => weatherState.currentWeather)
const forecast = computed(() => weatherState.forecast)

function formatDate(dt: number): string {
  return new Date(dt * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatUpdateTime(dt: number): string {
  return new Date(dt * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function goBack() { router.back() }
function refresh() { fetchDetail(props.city) }
</script>

<template>
  <main class="detail-page">

    <div v-if="weatherState.loading" class="detail-page__center">
      <p>Loading...</p>
    </div>

    <div v-else-if="weatherState.error" class="detail-page__center detail-page__center--error">
      <p>{{ weatherState.error }}</p>
    </div>

    <template v-else-if="weather">
      <!-- Blue hero section -->
      <div class="detail-page__hero">
        <header class="detail-page__header">
          <button class="detail-page__icon-btn" aria-label="Go back" @click="goBack">
            <FontAwesomeIcon :icon="['fas', 'arrow-left']" />
          </button>
          <h1 class="detail-page__city">{{ weather.name }}, {{ weather.sys.country }}</h1>
          <button class="detail-page__icon-btn" aria-label="Remove city">
            <FontAwesomeIcon :icon="['fas', 'trash']" />
          </button>
        </header>

        <p class="detail-page__date">{{ formatDate(weather.dt) }}</p>

        <img
          class="detail-page__weather-icon"
          :src="`https://openweathermap.org/img/wn/${weather.weather[0]?.icon}@4x.png`"
          :alt="weather.weather[0]?.description"
        />

        <p class="detail-page__temp">{{ Math.round(weather.main.temp) }}° C</p>
        <!-- Use description for full text e.g. "Moderate Rain" not just "Rain" -->
        <p class="detail-page__condition">
          {{ weather.weather[0]?.description.replace(/\b\w/g, c => c.toUpperCase()) }}
        </p>

        <div class="detail-page__update">
          <span>Last Update {{ formatUpdateTime(weather.dt) }}</span>
          <button class="detail-page__refresh-btn" aria-label="Refresh" @click="refresh">
            <FontAwesomeIcon :icon="['fas', 'rotate']" />
          </button>
        </div>
      </div>

      <!-- White forecasts section — rounded top overlaps the blue -->
      <div class="detail-page__forecasts">
        <HourlyForecast
          v-if="forecast.length > 0"
          :items="forecast"
          :timezone-offset="weather.timezone"
        />
        <WeeklyForecast
          v-if="forecast.length > 0"
          :items="forecast"
        />
      </div>
    </template>
  </main>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f0f2f8;
}

/* Periwinkle blue — matches the Figma hero */
.detail-page__hero {
  background: #4a5bc8;
  padding: 16px 20px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ffffff;
}

.detail-page__header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-page__icon-btn {
  background: none;
  border: none;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
}

.detail-page__city {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.detail-page__date {
  font-size: 14px;
  opacity: 0.9;
  margin: 0 0 4px 0;
}

.detail-page__weather-icon {
  width: 140px;
  height: 140px;
  margin: 4px 0;
}

.detail-page__temp {
  font-size: 36px;
  font-weight: 300;
  margin: 0;
  letter-spacing: 1px;
}

.detail-page__condition {
  font-size: 22px;
  font-weight: 700;
  margin: 6px 0 20px 0;
}

.detail-page__update {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  opacity: 0.85;
}

.detail-page__refresh-btn {
  background: none;
  border: none;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
}

/* White section — straight edge, no curve */
.detail-page__forecasts {
  background: #ffffff;
  padding-top: 8px;
  min-height: 60vh;
}

.detail-page__center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: var(--color-text-muted);
}

.detail-page__center--error {
  color: var(--color-error);
}
</style>
