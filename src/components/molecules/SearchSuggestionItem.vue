<script setup lang="ts">
// Molecule: SearchSuggestionItem
// One row in the search suggestions list.
// Shows city name bold + country/state in grey, separated by a line underneath.

defineProps<{
  city: string
  region: string  // e.g. "Italy" or "TN United States"
}>()

defineEmits<{
  select: []
}>()
</script>

<template>
  <li
    class="suggestion-item"
    role="option"
    tabindex="0"
    @click="$emit('select')"
    @keyup.enter="$emit('select')"
  >
    <p class="suggestion-item__text">
      <span class="suggestion-item__city">{{ city }}, </span>
      <span class="suggestion-item__region">{{ region }}</span>
    </p>
  </li>
</template>

<style scoped>
.suggestion-item {
  list-style: none;
  padding: 16px 0;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item__city {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.suggestion-item__region {
  font-size: 16px;
  color: var(--color-text-muted);
}
</style>
