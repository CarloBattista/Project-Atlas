<template>
  <div class="avatar-container relative w-fit" :class="'size-' + size">
    <div class="avatar aspect-square rounded-full flex items-center justify-center text-center overflow-hidden bg-green-500">
      <img v-if="image" :src="image" alt="Profile image" class="profile-image not-first:absolute z-10 top-0 left-0 w-full h-full object-cover" />
      <span v-else class="fallback-text font-medium uppercase">{{ fallback }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tl-avatar',
  props: {
    size: {
      type: String,
      default: 'medium',
    },
    image: String,
    fallback: String,
  },
};
</script>

<style scoped>
/* SIZES */
.avatar-container.size-extra-small .avatar {
  height: 36px;
  font-size: 18px;
}

.avatar-container.size-small .avatar {
  height: 56px;
  font-size: 24px;
}

.avatar-container.size-medium .avatar {
  height: 80px;
  font-size: 32px;
}

.avatar-container.size-large .avatar {
  height: 120px;
  font-size: 48px;
}
</style>
