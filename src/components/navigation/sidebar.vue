<template>
  <div class="sidebar border-r border-black/5 bg-[#f2f2f2]" :class="{ collapsed: store.sidebarOptions.isCollapsed }">
    <div class="w-full h-full flex flex-col">
      <!-- HEAD -->
      <div class="logo-container relative w-full flex items-center">
        <RouterLink to="/" class="appLogo">
          <appLogo type="rounded" class="w-11 h-11" />
        </RouterLink>
        <div
          @click="store.sidebarOptions.isCollapsed = !store.sidebarOptions.isCollapsed"
          class="menu-toggle ml-auto"
          :class="{ 'menu-collapsed': store.sidebarOptions.isCollapsed }"
        >
          <PanelLeftClose />
        </div>
      </div>
      <!-- BODY -->
      <div class="w-full h-full py-8 flex flex-col gap-1">
        <RouterLink to="/" class="nav-item">
          <div class="nav-icon">
            <LayoutDashboard size="22" />
          </div>
          <Transition name="slide-fade">
            <span v-if="!store.sidebarOptions.isCollapsed" class="nav-label">Dashboard</span>
          </Transition>
        </RouterLink>
        <RouterLink to="/invoices" class="nav-item">
          <div class="nav-icon">
            <Files size="22" />
          </div>
          <Transition name="slide-fade">
            <span v-if="!store.sidebarOptions.isCollapsed" class="nav-label">Invoices</span>
          </Transition>
        </RouterLink>
        <RouterLink to="/clients" class="nav-item">
          <div class="nav-icon">
            <UsersRound size="22" />
          </div>
          <Transition name="slide-fade">
            <span v-if="!store.sidebarOptions.isCollapsed" class="nav-label">Clients</span>
          </Transition>
        </RouterLink>
        <RouterLink v-if="false" to="/analytics" class="nav-item">
          <div class="nav-icon">
            <ChartLine size="22" />
          </div>
          <Transition name="slide-fade">
            <span v-if="!store.sidebarOptions.isCollapsed" class="nav-label">Analytics</span>
          </Transition>
        </RouterLink>
      </div>

      <!-- FOOTER -->
      <div class="w-full">
        <RouterLink to="/settings" class="w-full flex gap-3 items-center overflow-hidden cursor-pointer">
          <tlAvatar size="small" :fallback="auth.profile?.first_name ? auth.profile?.first_name?.charAt(0) : auth.user?.email?.charAt(0)" />
          <Transition name="slide-fade">
            <div v-if="!store.sidebarOptions.isCollapsed" class="h-full flex flex-col">
              <h2 class="text-black text-sm font-medium max-one-line">{{ auth.profile?.first_name }} {{ auth.profile?.last_name }}</h2>
              <p v-if="auth.user?.email" class="text-gray-500 text-xs font-normal max-one-line">{{ auth.user?.email }}</p>
            </div>
          </Transition>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script>
import { auth } from '../../data/auth';
import { store } from '../../data/store';

import appLogo from '../global/app-logo.vue';
import tlAvatar from '../avatar/tl-avatar.vue';

// ICONS
import { LayoutDashboard, Files, UsersRound, ChartLine, PanelLeftClose } from '@lucide/vue';

export default {
  name: 'sidebar',
  components: {
    appLogo,
    tlAvatar,

    // ICONS
    LayoutDashboard,
    Files,
    UsersRound,
    ChartLine,
    PanelLeftClose,
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
  min-width: 69px;
  max-width: 240px;
  height: 100svh;
  padding: 32px 12px;
  transition-property: width;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.sidebar.collapsed {
  width: 69px;
}

.nav-item {
  background-color: transparent;
  color: #656565;
  height: 44px;
  padding: 0 12px;
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
  background-color: #f5f5f5;
  color: #000;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15) inset;
}

.nav-item:not(.router-link-active):hover {
  color: #212121;
}

.nav-icon {
  position: relative;
  left: -2px;
  height: 100%;
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
}

.nav-label {
  font-weight: 500;
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

.menu-toggle {
  position: relative;
  height: 44px;
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  opacity: 0;
  visibility: hidden;
}

.sidebar:not(.collapsed) .menu-toggle {
  opacity: 1;
  visibility: visible;
}

.sidebar.collapsed .menu-toggle {
  position: absolute;
  background-color: #ff32ba;
  color: white;
}

.sidebar.collapsed .logo-container:hover .menu-toggle {
  opacity: 1;
  visibility: visible;
}
</style>
