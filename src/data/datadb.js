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
  clients: {
    data: [],
    error: null,
    loading: true,
  },
  client: {
    data: {},
    error: null,
    loading: false,
  },
});
