<script setup lang="ts">
// Atom: BaseInput
// A single input field with a floating label above it (like the profile form fields).
// Supports v-model so the parent can easily read what the user typed.
// Shows a red border + error message when 'error' prop is passed.

defineProps<{
  modelValue: string
  label: string
  type?: 'text' | 'email' | 'tel'
  error?: string
  readonly?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <!-- Outer box acts as the visible bordered container -->
  <div
    class="base-input"
    :class="{ 'base-input--error': error, 'base-input--readonly': readonly }"
  >
      <!-- Label sits inside the border at the top -->
    <label class="base-input__label">{{ label }}</label>
    <!-- Input row: optional prefix (e.g. flag emoji) + the actual input -->
    <div class="base-input__row">
      <span v-if="$slots.prefix" class="base-input__prefix"><slot name="prefix" /></span>
      <input
        class="base-input__field"
        :value="modelValue"
        :type="type ?? 'text'"
        :readonly="readonly"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <!-- Only renders when there is a validation error -->
    <span v-if="error" class="base-input__error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
/* The whole box — border lives here, not on the input itself */
.base-input {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 16px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  background: #ffffff;
  transition: border-color 0.2s;
}

.base-input:focus-within {
  border-color: var(--color-dark-navy);
}

.base-input--error {
  border-color: var(--color-error);
}

/* Label is small and sits at the top inside the box */
.base-input__label {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1;
}

.base-input__row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.base-input__prefix {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

/* Input has no border or background — the outer box handles that */
.base-input__field {
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--color-text-primary);
  outline: none;
  padding: 0;
  flex: 1;
}

.base-input--readonly {
  cursor: default;
}

.base-input__error {
  font-size: 12px;
  color: var(--color-error);
  margin-top: 2px;
}
</style>
