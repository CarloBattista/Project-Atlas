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
    invoice: {
      isOpen: false,
      data: {},
      errors: {},
      loading: false,
    },

    fullname: {
      isOpen: false,
      data: {
        first_name: '',
        last_name: '',
      },
      errors: {
        first_name: null,
        last_name: null,
      },
      loading: false,
    },
    newEmail: {
      isOpen: false,
      data: {
        email: '',
      },
      errors: {
        email: null,
      },
      loading: false,
    },
    phone: {
      isOpen: false,
      data: {
        phone: '',
      },
      errors: {
        phone: null,
      },
      loading: false,
    },
  },
});
