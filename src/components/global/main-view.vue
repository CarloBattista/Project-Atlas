<template>
  <div class="main-view relative top-0 left-0 w-full" :class="{ 'menu-collapsed': store.sidebarOptions.isCollapsed }">
    <div class="w-full h-full md:px-4 py-8 px-3">
      <slot />
    </div>
  </div>
</template>

<script>
import { store } from '../../data/store';

export default {
  name: 'main-view',
  data() {
    return {
      store,
    };
  },
};
</script>

<style scoped>
.main-view {
  padding-left: 240px;

  transition-property: padding-left;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.main-view.menu-collapsed {
  padding-left: 69px;
}
</style>
