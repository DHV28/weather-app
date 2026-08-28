<script setup lang="ts">
// Molecule: HourlyCard
// One card in the hourly forecast row.
// Icon on top, bold temperature in the middle, time at the bottom.

defineProps<{
  iconCode: string
  condition: string
  temperature: number
  time: string
}>()
</script>

<template>
  <div class="hourly-card">
    <img
      class="hourly-card__icon"
      :src="`https://openweathermap.org/img/wn/${iconCode}@4x.png`"
      :alt="condition"
    />
    <p class="hourly-card__temp">{{ temperature }}°</p>
    <p class="hourly-card__time">{{ time }}</p>
  </div>
</template>

<style scoped>
.hourly-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #eeeff1;
  border-radius: 14px;
  padding: 12px 8px;
  gap: 2px;
  min-width: 0;
}

.hourly-card__icon {
  width: 60px;
  height: 60px;
  /* Adds outline around light/white icons so they show on grey background */
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
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
