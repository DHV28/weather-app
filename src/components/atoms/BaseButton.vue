<script setup lang="ts">
// Atom: BaseButton
// The most basic button in the app — used on any page that needs a clickable button.
// 'variant' controls the look: 'primary' is the dark filled style, 'secondary' is outlined.
// 'disabled' greys it out and stops it from being clicked.

defineProps<{
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    class="base-button"
    :class="`base-button--${variant ?? 'primary'}`"
    :disabled="disabled"
    :type="type ?? 'button'"
  >
    <!-- slot lets the parent decide what text or icon goes inside the button -->
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.base-button--primary {
  background-color: var(--color-dark-navy);
  color: #ffffff;
}

.base-button--secondary {
  background-color: transparent;
  color: var(--color-dark-navy);
  border: 2px solid var(--color-dark-navy);
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
