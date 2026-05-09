import { reactive } from 'vue';

export const datadb = reactive({
  invoices: {
    data: [],
    totalCount: 0,
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
    totalCount: 0,
    error: null,
    loading: true,
  },
  client: {
    data: {},
    error: null,
    loading: false,
  },
});
