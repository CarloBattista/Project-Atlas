<template>
  <div class="sidebar md:px-4 md:py-8 px-2 py-4 border-r border-black/5 bg-[#f2f2f2]" :class="{ collapsed: store.sidebarOptions.isCollapsed }">
    <div class="w-full h-full flex flex-col">
      <!-- HEAD -->
      <div class="w-full flex items-center">
        <RouterLink to="/">
          <appLogo class="h-6" />
        </RouterLink>
      </div>
      <!-- BODY -->
      <div class="w-full h-full pt-8 flex flex-col gap-1">
        <RouterLink to="/" class="nav-item">
          <div class="nav-icon">
            <LayoutDashboard size="22" />
          </div>
          <Transition name="slide-fade">
            <span v-if="!store.sidebarOptions.isCollapsed" class="nav-label">Dashboard</span>
          </Transition>
        </RouterLink>
      </div>

      <!-- FOOTER -->
      <div class="w-full">
        <tlButton leftIcon="Plus" label="Add new invoice" class="w-full mb-6" />
        <div class="w-full flex gap-3 items-center">
          <tlAvatar size="small" fallback="c" />
          <div v-if="!store.sidebarOptions.isCollapsed" class="h-full flex flex-col">
            <h2 class="text-black text-sm font-medium max-one-line">{{ auth.profile?.first_name }} {{ auth.profile?.last_name }}</h2>
            <p v-if="auth.user?.email" class="text-gray-500 text-xs font-normal max-one-line">{{ auth.user?.email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../data/auth';
import { store } from '../../data/store';

import appLogo from '../global/app-logo.vue';
import tlButton from '../button/tl-button.vue';
import tlAvatar from '../avatar/tl-avatar.vue';

// ICONS
import { LayoutDashboard } from '@lucide/vue';

export default {
  name: 'sidebar',
  components: {
    appLogo,
    tlButton,
    tlAvatar,

    // ICONS
    LayoutDashboard,
  },
  data() {
    return {
      auth,
      store,
    };
  },
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 240px;
  min-width: 70px;
  max-width: 240px;
  height: 100svh;
  transition-property: width;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.sidebar.collapsed {
  width: 70px;
}

.nav-item {
  background-color: transparent;
  color: #626262;
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  cursor: pointer;
  overflow: hidden;

  transition-property: background-color, color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

.nav-item.router-link-active {
  background-color: #fff;
  color: #000;
  box-shadow: 0 0 0 1px #d4d4d4 inset;
}

.nav-item:not(.router-link-active):hover {
  background-color: #fff;
}

.nav-icon {
  height: 100%;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-weight: 400;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
