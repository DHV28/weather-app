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
  <div class="base-input">
    <!-- Label floats above the input field -->
    <label class="base-input__label">{{ label }}</label>
    <input
      class="base-input__field"
      :class="{ 'base-input__field--error': error, 'base-input__field--readonly': readonly }"
      :value="modelValue"
      :type="type ?? 'text'"
      :readonly="readonly"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <!-- Only renders when there is a validation error -->
    <span v-if="error" class="base-input__error" role="alert">{{ error }}</span>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.base-input__label {
  font-size: 12px;
  color: var(--color-text-muted);
  padding: 0 4px;
}

.base-input__field {
  padding: 14px 16px;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 16px;
  color: var(--color-text-primary);
  background: var(--color-input-bg);
  outline: none;
  transition: border-color 0.2s;
}

.base-input__field:focus {
  border-color: var(--color-dark-navy);
}

.base-input__field--error {
  border-color: var(--color-error);
}

/* Readonly fields look the same visually but cannot be typed into */
.base-input__field--readonly {
  background: var(--color-input-bg);
  cursor: default;
}

.base-input__error {
  font-size: 12px;
  color: var(--color-error);
  padding: 0 4px;
}
</style>
