<script setup lang="ts">
// Atom: AvatarImage
// Displays a circular profile photo.
// When 'editable' is true, a pencil icon appears over the bottom-right corner
// so the user knows they can tap it to change their photo.

defineProps<{
  src: string
  alt?: string
  editable?: boolean
}>()

defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="avatar" :class="{ 'avatar--editable': editable }">
    <img class="avatar__image" :src="src" :alt="alt ?? 'Profile photo'" />

    <!-- Pencil edit button — only visible when editable is true -->
    <button
      v-if="editable"
      class="avatar__edit-btn"
      aria-label="Change profile photo"
      @click="$emit('edit')"
    >
      <FontAwesomeIcon :icon="['fas', 'pencil']" style="color: rgb(0, 0, 0);" />
    </button>
  </div>
</template>

<style scoped>
.avatar {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.avatar__image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  /* Light blue background ring matches the Figma design */
  border: 4px solid var(--color-avatar-ring);
}

.avatar__edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid var(--color-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
</style>
