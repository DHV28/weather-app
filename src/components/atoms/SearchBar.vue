<script setup lang="ts">
// Atom: SearchBar
// The pill-shaped search input at the top of the home page.
// Emits the typed value upward so the parent can trigger a search.

defineProps<{
  modelValue: string
  placeholder?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()
</script>

<template>
  <div class="search-bar">
    <!-- Search icon on the left -->
    <FontAwesomeIcon :icon="['fas', 'magnifying-glass']" class="search-bar__icon" />
    <input
      class="search-bar__input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder ?? 'Search for a city or airport'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keyup.enter="$emit('search', modelValue)"
    />
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f0f2f5;
  border-radius: 50px;
  padding: 12px 18px;
}

.search-bar__icon {
  color: #8a8a9a;
  font-size: 14px;
  flex-shrink: 0;
}

.search-bar__input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 15px;
  color: var(--color-text-primary);
  outline: none;
}

.search-bar__input::placeholder {
  color: #8a8a9a;
}
</style>
