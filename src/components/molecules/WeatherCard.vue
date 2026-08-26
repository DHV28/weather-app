<script setup lang="ts">
// Molecule: WeatherCard
// One city card in the list — shows city name, local time, condition, temp, H/L.
// Background image changes based on the weather condition from the API.

import bgClear from '../../assets/bg-clear.jpg'
import bgRain from '../../assets/bg-rain.jpg'
import bgCloudy from '../../assets/bg-cloudy.jpg'
import bgSnow from '../../assets/bg-snow.jpg'
import bgDefault from '../../assets/bg-default.jpg'

const props = defineProps<{
  city: string
  subtitle: string
  temperature: number
  condition: string
  high: number
  low: number
  isMyLocation?: boolean
}>()

defineEmits<{
  select: []
}>()

// Maps the weather condition string to the right background photo
function getBackground(condition: string): string {
  const c = condition.toLowerCase()
  if (c.includes('rain') || c.includes('drizzle')) return `url(${bgRain})`
  if (c.includes('snow') || c.includes('sleet'))   return `url(${bgSnow})`
  if (c.includes('clear') || c.includes('sunny'))  return `url(${bgClear})`
  if (c.includes('cloud') || c.includes('storm') || c.includes('thunder')) return `url(${bgCloudy})`
  return `url(${bgDefault})`
}

const cardBackground = getBackground(props.condition)
</script>

<template>
  <article
    class="weather-card"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keyup.enter="$emit('select')"
  >
    <!-- Dark overlay so white text is readable over any photo -->
    <div class="weather-card__overlay">
      <div class="weather-card__top">
        <div>
          <p v-if="isMyLocation" class="weather-card__my-location-label">My Location</p>
          <h2 class="weather-card__city">{{ city }}</h2>
          <p class="weather-card__subtitle">{{ subtitle }}</p>
        </div>
        <p class="weather-card__temp">{{ temperature }}°</p>
      </div>

      <div class="weather-card__bottom">
        <p class="weather-card__condition">{{ condition }}</p>
        <p class="weather-card__range">H:{{ high }}° L:{{ low }}°</p>
      </div>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  border-radius: 16px;
  overflow: hidden;
  min-height: 120px;
  cursor: pointer;
  transition: transform 0.15s ease;
  /* v-bind lets us use the JS variable directly in CSS */
  background-image: v-bind(cardBackground);
  background-size: cover;
  background-position: center;
}

.weather-card:hover {
  transform: scale(1.01);
}

/* Semi-transparent dark layer so text stays readable over any photo */
.weather-card__overlay {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  padding: 16px 20px;
  background: rgba(0, 0, 0, 0.35);
  color: #ffffff;
}

.weather-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.weather-card__my-location-label {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.85;
  margin: 0 0 2px 0;
}

.weather-card__city {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.weather-card__subtitle {
  font-size: 13px;
  opacity: 0.8;
  margin: 2px 0 0 0;
}

.weather-card__temp {
  font-size: 48px;
  font-weight: 200;
  margin: 0;
  line-height: 1;
}

.weather-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 12px;
}

.weather-card__condition {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.weather-card__range {
  font-size: 13px;
  opacity: 0.85;
  margin: 0;
}
</style>
