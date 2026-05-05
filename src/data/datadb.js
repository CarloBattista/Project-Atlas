import { reactive } from 'vue';

export const datadb = reactive({
  invoices: {
    data: [],
    error: null,
    loading: true,
  },
  invoice: {
    data: {},
    error: null,
    loading: false,
  },
});
