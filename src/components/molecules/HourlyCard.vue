<script setup lang="ts">
// Molecule: HourlyCard
// One card in the hourly forecast row.
// Icon on top, bold temperature in the middle, time at the bottom.

defineProps<{
  iconCode: string
  temperature: number
  time: string
}>()
</script>

<template>
  <div class="hourly-card">
    <img
      class="hourly-card__icon"
      :src="`https://openweathermap.org/img/wn/${iconCode}@4x.png`"
      alt="weather icon"
    />
    <p class="hourly-card__temp">{{ temperature }}°</p>
    <p class="hourly-card__time">{{ time }}</p>
  </div>
</template>

<style scoped>
.hourly-card {
  flex: 1;               /* all 4 cards share equal width */
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f2f3f8;
  border-radius: 14px;
  padding: 12px 8px;
  gap: 2px;
  min-width: 0;          /* prevents flex blowout */
}

.hourly-card__icon {
  width: 52px;
  height: 52px;
}

.hourly-card__temp {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.hourly-card__time {
  font-size: 12px;
  color: var(--color-text-muted);
  margin: 0;
}
</style>
