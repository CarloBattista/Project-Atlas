import { reactive } from 'vue';

export const store = reactive({
  LANG: 'it-IT',
  FALLBACK_LANG: 'en-US',

  windowOptions: {
    screenSize: 'desktop',
    isMobile: false,
  },
  sidebarOptions: {
    isCollapsed: false,
  },
});
