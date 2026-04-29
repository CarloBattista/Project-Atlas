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
          invoiceAnalysis: null,
          analysisType: null, // 'local' o 'ai'
        },
        supplier_name: '',
        supplier_number: '',
        amount: '0',
        currency: 'EUR',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date().toISOString().split('T')[0],
      },
      errors: {},
      loading: false,
    },
  },
});
