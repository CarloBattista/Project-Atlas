import { reactive } from 'vue';

export const store = reactive({
  LANG: 'it-IT',
  FALLBACK_LANG: 'en-US',

  windowOptions: {
    screenSize: 'desktop',
    isMobile: false,
  },
  sidebarOptions: {
    isCollapsed: true,
  },

  modals: {
    newInvoice: {
      isOpen: false,
      data: {
        file: {
          selectedFile: null,
          error: null,
          loading: false,
          loadingStatus: '',
          progress: 0,
        },
      },
      errors: {},
      loading: false,
    },
  },
});
