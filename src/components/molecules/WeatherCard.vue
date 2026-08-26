<script setup lang="ts">
// Molecule: WeatherCard
// One city card in the list — shows city name, local time, condition, temp, H/L.
// 'isMyLocation' makes the first card bold with "My Location" label (like the Figma).
// Clicking the card will navigate to the detail page (wired up in HomePage).

defineProps<{
  city: string
  subtitle: string       // local time or area name (e.g. "Bangsar South" or "7:30 PM")
  temperature: number
  condition: string
  high: number
  low: number
  isMyLocation?: boolean
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <article
    class="weather-card"
    :class="{ 'weather-card--my-location': isMyLocation }"
    role="button"
    tabindex="0"
    @click="$emit('select')"
    @keyup.enter="$emit('select')"
  >
    <!-- Top row: city name + temperature -->
    <div class="weather-card__top">
      <div>
        <!-- Show "My Location" label above city name for the user's current location -->
        <p v-if="isMyLocation" class="weather-card__my-location-label">My Location</p>
        <h2 class="weather-card__city">{{ city }}</h2>
        <p class="weather-card__subtitle">{{ subtitle }}</p>
      </div>
      <p class="weather-card__temp">{{ temperature }}°</p>
    </div>

    <!-- Bottom row: weather condition + H/L range -->
    <div class="weather-card__bottom">
      <p class="weather-card__condition">{{ condition }}</p>
      <p class="weather-card__range">H:{{ high }}° L:{{ low }}°</p>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  /* Dark blue sky gradient — matches the card backgrounds in the Figma */
  background: linear-gradient(135deg, #3a5f8a 0%, #2c3e6b 60%, #1a2a4a 100%);
  border-radius: 16px;
  padding: 16px 20px;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  transition: transform 0.15s ease;
}

.weather-card:hover {
  transform: scale(1.01);
}

/* First card has a slightly lighter/warmer blue tint */
.weather-card--my-location {
  background: linear-gradient(135deg, #4a6fa5 0%, #3a5080 60%, #243660 100%);
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

/* Large temperature number on the right */
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
