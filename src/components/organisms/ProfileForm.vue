<script setup lang="ts">
// Organism: ProfileForm
// Two modes:
//   - View mode (isEditing = false): fields readonly, no pencil, button says EDIT
//   - Edit mode (isEditing = true): fields editable, pencil on avatar, button says SUBMIT

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

function handleButtonClick() {
  if (!isEditing.value) {
    // EDIT clicked — switch to edit mode
    isEditing.value = true
  } else {
    // SUBMIT clicked — save and return to view mode
    isEditing.value = false
  }
}
</script>

<template>
  <div class="profile-form">
    <!-- Avatar: pencil icon only appears in edit mode -->
    <div class="profile-form__avatar-section">
      <AvatarImage
        :src="PLACEHOLDER_AVATAR"
        alt="Profile photo"
        :editable="isEditing"
      />
      <p class="profile-form__name">{{ form.fullName }}</p>
      <p class="profile-form__meta">{{ form.email }} | +01 234 567 89</p>
    </div>

    <!-- Fields: readonly in view mode, editable in edit mode -->
    <div class="profile-form__fields">
      <BaseInput
        v-model="form.fullName"
        label="Full name"
        :readonly="!isEditing"
      />
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        :readonly="!isEditing"
      />
      <BaseInput
        v-model="form.phone"
        label="Phone Number"
        type="tel"
        :readonly="!isEditing"
      />
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
  padding: 24px 20px;
}

.profile-form__avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
}

.profile-form__name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.profile-form__meta {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.profile-form__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.profile-form__action {
  margin-top: auto;
  padding-top: 24px;
}
</style>
