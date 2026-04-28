<template>
  <div class="avatar-group relative flex items-center" :class="'size-' + size">
    <tlAvatar
      :size="size"
      image="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      fallback="c"
    />
    <tlAvatar
      :size="size"
      image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      fallback="a"
    />
    <tlAvatar :size="size" fallback="b" />
    <tlAvatar
      :size="size"
      image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      fallback="j"
    />
    <div class="last-avatar-info relative aspect-square rounded-full flex items-center justify-center text-center bg-[#1c1c1c] text-white">
      <span class="font-medium uppercase">6+</span>
    </div>
  </div>
</template>

<script>
import tlAvatar from './tl-avatar.vue';

export default {
  name: 'tl-avatar-group',
  components: {
    tlAvatar,
  },
  props: {
    size: {
      type: String,
      default: 'extra-small',
    },
  },
};
</script>

<style scoped>
.avatar-group .avatar-container {
  position: relative;
  margin-left: -10px;
  border-radius: 50%;
  border: 2px solid #fff;
}

.avatar-group .avatar-container:nth-child(1) {
  z-index: 1;
}

.avatar-group .avatar-container:nth-child(2) {
  z-index: 2;
}

.avatar-group .avatar-container:nth-child(3) {
  z-index: 3;
}

.avatar-group .avatar-container:nth-child(4) {
  z-index: 4;
}

.last-avatar-info {
  z-index: 5;
  margin-left: -10px;
  outline: 2px solid #fff;
}

/* SIZES */
.avatar-group.size-extra-small .last-avatar-info {
  height: 36px;
  font-size: 16px;
}

.avatar-group.size-small .last-avatar-info {
  height: 56px;
  font-size: 22px;
}

.avatar-group.size-medium .last-avatar-info {
  height: 80px;
  font-size: 30px;
}

.avatar-group.size-large .last-avatar-info {
  height: 120px;
  font-size: 46px;
}
</style>
