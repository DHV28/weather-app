<script setup lang="ts">
// Organism: ProfileForm
// Two modes:
//   - View mode (isEditing = false): fields readonly, no pencil, button says EDIT
//   - Edit mode (isEditing = true): fields editable, pencil on avatar, button says SUBMIT
//
// Validation runs only on SUBMIT. If any field is invalid, error messages
// appear below the field and we stay in edit mode so the user can fix them.

import { ref, reactive } from 'vue'
import avatarImg from '../../assets/avatar.png'
import AvatarImage from '../atoms/AvatarImage.vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'

const PLACEHOLDER_AVATAR = avatarImg

// Controls which mode we are in
const isEditing = ref(false)

// Holds the editable form values
const form = reactive({
  fullName: 'Jane Doe',
  email: 'jane@gmail.com',
  phone: '123 - 456 - 7890',
})

// One error string per field — empty string means no error
const errors = reactive({
  fullName: '',
  email: '',
  phone: '',
})

// --- Validation rules ---

// Full name: required, at least 2 characters, max 50 characters
function validateFullName(value: string): string {
  if (!value.trim()) return 'Full name is required.'
  if (value.trim().length < 2) return 'Full name must be at least 2 characters.'
  if (value.trim().length > 50) return 'Full name cannot exceed 50 characters.'
  return ''
}

// Email: required and must match a basic email pattern
function validateEmail(value: string): string {
  if (!value.trim()) return 'Email is required.'
  // Simple regex: something@something.something
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(value.trim())) return 'Please enter a valid email address.'
  return ''
}

// Phone: required, digits/spaces/dashes only, between 7 and 15 digits
function validatePhone(value: string): string {
  if (!value.trim()) return 'Phone number is required.'
  // Strip all non-digit characters to count the actual digits
  const digitsOnly = value.replace(/\D/g, '')
  if (digitsOnly.length < 7) return 'Phone number is too short.'
  if (digitsOnly.length > 15) return 'Phone number is too long.'
  // Allow digits, spaces, dashes, parentheses, and + for country codes
  const phonePattern = /^[0-9\s\-+(). ]+$/
  if (!phonePattern.test(value.trim())) return 'Phone number contains invalid characters.'
  return ''
}

// Runs all three validators and writes results into errors reactive object.
// Returns true if everything is valid, false if anything failed.
function validateAll(): boolean {
  errors.fullName = validateFullName(form.fullName)
  errors.email    = validateEmail(form.email)
  errors.phone    = validatePhone(form.phone)
  // If all three error strings are empty, the form is valid
  return !errors.fullName && !errors.email && !errors.phone
}

// Clear all error messages (e.g. when switching back to view mode without submitting)
function clearErrors() {
  errors.fullName = ''
  errors.email    = ''
  errors.phone    = ''
}

function handleButtonClick() {
  if (!isEditing.value) {
    // EDIT clicked — switch to edit mode, any old errors get cleared
    clearErrors()
    isEditing.value = true
  } else {
    // SUBMIT clicked — validate first; only exit edit mode if everything passes
    if (validateAll()) {
      isEditing.value = false
    }
    // If validation failed, we stay in edit mode and errors are shown under each field
  }
}
</script>

<template>
  <div class="profile-form">
    <!-- Blue hero section — avatar is pinned to its bottom edge, straddling the curve -->
    <div class="profile-form__hero">
      <div class="profile-form__avatar-wrap">
        <AvatarImage
          :src="PLACEHOLDER_AVATAR"
          alt="Profile photo"
          :editable="isEditing"
        />
      </div>
    </div>

    <!-- Name and meta sit in white area below the curve -->
    <div class="profile-form__identity">
      <p class="profile-form__name">{{ form.fullName }}</p>
      <p class="profile-form__meta">{{ form.email }} | +01 234 567 89</p>
    </div>

    <!-- Fields: readonly in view mode, editable in edit mode -->
    <!-- Error messages appear under each field only after a failed SUBMIT attempt -->
    <div class="profile-form__fields">
      <BaseInput
        v-model="form.fullName"
        label="Full name"
        :readonly="!isEditing"
        :error="errors.fullName"
      />
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        :readonly="!isEditing"
        :error="errors.email"
      />
      <!-- Phone field: flag passed via slot so it stays in line with the input -->
      <BaseInput
        v-model="form.phone"
        label="Phone Number"
        type="tel"
        :readonly="!isEditing"
        :error="errors.phone"
      >
        <template #prefix>🇺🇸</template>
      </BaseInput>
    </div>

    <!-- Button text switches between EDIT and SUBMIT -->
    <div class="profile-form__action">
      <BaseButton @click="handleButtonClick">
        {{ isEditing ? 'SUBMIT' : 'EDIT' }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.profile-form {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 60px);
  background: #ffffff;
}

/* Blue section — fixed height, avatar absolutely pinned to its bottom centre */
.profile-form__hero {
  background: #f5f8ff;
  border-radius: 0 0 40% 40%;
  position: relative;
  height: 140px;
  /* margin-bottom makes room for the part of the avatar that hangs below */
  margin-bottom: 40px;
}

/* Avatar centred on the bottom edge — only 30px hangs below the curve */
.profile-form__avatar-wrap {
  position: absolute;
  bottom: -36px;
  left: 50%;
  transform: translateX(-50%);
}

/* Name and meta sit in the white area below */
.profile-form__identity {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 0 20px 20px;
}

.profile-form__name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.profile-form__meta {
  font-size: 14px;
  color: var(--color-text-primary);
  margin: 0;
}

.profile-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  padding: 0 20px;
}


.profile-form__action {
  margin-top: auto;
  padding: 24px 20px;
}
</style>
