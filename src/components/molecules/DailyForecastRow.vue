<script setup lang="ts">
// Molecule: DailyForecastRow
// One row in the Weekly Forecast list.

defineProps<{
  iconCode: string
  day: string
  condition: string
  temperature: number
}>()
</script>

<template>
  <div class="daily-row">
    <!-- Circular icon with medium-blue circle background -->
    <div class="daily-row__icon-wrap">
      <img
        class="daily-row__icon"
        :src="`https://openweathermap.org/img/wn/${iconCode}@4x.png`"
        alt="weather icon"
      />
    </div>

    <!-- Day and condition -->
    <div class="daily-row__info">
      <p class="daily-row__day">{{ day }}</p>
      <p class="daily-row__condition">{{ condition }}</p>
    </div>

    <!-- Temperature + chevron -->
    <div class="daily-row__right">
      <p class="daily-row__temp">{{ temperature }}° C</p>
      <FontAwesomeIcon :icon="['fas', 'chevron-right']" class="daily-row__chevron" />
    </div>
  </div>
</template>

<style scoped>
.daily-row {
  display: flex;
  align-items: center;
  gap: 14px;
  /* Soft lavender — matches the Figma weekly row background */
  background: #d2dfff;
  border-radius: 16px;
  padding: 14px 16px;
}

.daily-row__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #98b4fd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.daily-row__icon {
  width: 40px;
  height: 40px;
}

.daily-row__info {
  flex: 1;
}

.daily-row__day {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.daily-row__condition {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.daily-row__right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.daily-row__temp {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.daily-row__chevron {
  color: var(--color-text-primary);
  font-size: 13px;
}
</style>
