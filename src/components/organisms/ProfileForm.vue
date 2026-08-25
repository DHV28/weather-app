<script setup lang="ts">
// Organism: ProfileForm
// Static UI for the Edit Profile page — shows avatar, user info, and read-only fields.
// Edit functionality will be wired up in a later commit.

import avatarImg from '../../assets/avatar.png'
import AvatarImage from '../atoms/AvatarImage.vue'
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'

const PLACEHOLDER_AVATAR = avatarImg

</script>

<template>
  <div class="profile-form">
    <!-- Avatar + display name and contact info -->
    <div class="profile-form__avatar-section">
      <AvatarImage :src="PLACEHOLDER_AVATAR" alt="Jane Doe profile photo" />
      <p class="profile-form__name">Jane Doe</p>
      <p class="profile-form__meta">jane@gmail.com | +01 234 567 89</p>
    </div>

    <!-- Read-only fields showing current profile data -->
    <div class="profile-form__fields">
      <BaseInput label="Full name" model-value="Jane Doe" :readonly="true" />
      <BaseInput label="Email" model-value="jane@gmail.com" type="email" :readonly="true" />
      <BaseInput label="Phone Number" model-value="123 - 456 - 7890" type="tel" :readonly="true" />
    </div>

    <!-- EDIT button — will trigger edit mode in a future commit -->
    <div class="profile-form__action">
      <BaseButton>EDIT</BaseButton>
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

/* Pushes the EDIT button to the bottom of the page */
.profile-form__action {
  margin-top: auto;
  padding-top: 24px;
}
</style>
