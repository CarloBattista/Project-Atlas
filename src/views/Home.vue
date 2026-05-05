<template>
  <sidebar />
  <mainView>
    <div class="w-full h-11 flex items-center">
      <h1 v-if="auth.profile" class="text-black text-2xl font-semibold">Bentornato, {{ auth.profile?.first_name }}!</h1>
      <div class="ml-auto flex gap-2 items-center">
        <RouterLink to="/new-invoice">
          <tlButton size="small" variant="tertiary" leftIcon="Plus" label="Nuova fattura" />
        </RouterLink>
      </div>
    </div>
    <div class="w-full mt-8 flex flex-col gap-6">
      <shelf>
        <div class="w-full h-full flex flex-col gap-2.5">
          <div class="w-full flex gap-2 items-center">
            <ChartLine size="20" />
            <span class="text-black text-base font-medium">Analytics</span>
            <span v-if="false" class="text-[#656565] text-xs font-medium">(10)</span>
          </div>
          <div class="w-full grid gap-2 lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
            <cardInfo
              firstLabel="Total Invoices"
              :head="datadb.invoices.data?.length + ' ' + 'Invoices'"
              description=""
              icon="Zap"
              bottomLabel="98% from last month"
              class="w-full"
            />
            <cardInfo
              firstLabel="Total Members"
              head="3 Clients"
              description="All registered users"
              icon="Zap"
              bottomLabel="98% from last month"
              class="w-full"
            />
            <cardInfo
              firstLabel="Total Members"
              head="3 Clients"
              description="All registered users"
              icon="Clock4"
              bottomLabel="98% from last month"
              class="w-full"
            />
            <cardInfo
              firstLabel="Total Members"
              head="3 Clients"
              description="All registered users"
              icon="Clock4"
              bottomLabel="98% from last month"
              class="w-full"
            />
          </div>
        </div>
      </shelf>
      <shelf v-if="datadb.invoices.data">
        <div class="w-full h-full flex flex-col gap-2.5">
          <div class="w-full flex gap-2 items-center">
            <Files size="20" />
            <span class="text-black text-base font-medium">Fatture</span>
            <span class="text-[#656565] text-xs font-medium">({{ datadb.invoices.data?.length }})</span>
          </div>
          <div v-if="datadb.invoices?.data.length >= 1" class="w-full flex flex-col gap-1">
            <cardRow @click="handleInvoice(invoice.id)" v-for="(invoice, invoiceIndex) in datadb.invoices.data" :key="invoiceIndex">
              <div class="w-full lg:max-w-[300px] max-w-fit flex gap-2 items-center">
                <tlAvatar size="small" :fallback="invoice?.supplier_name.charAt(0)" />
                <div class="h-full lg:flex hidden flex-col">
                  <h2 class="text-black text-sm font-medium max-one-line">{{ invoice?.supplier_name }}</h2>
                  <p v-if="false" class="text-gray-500 text-xs font-normal max-one-line">mail@gmail.com</p>
                </div>
              </div>
              <div class="w-full ml-4 grid lg:grid-cols-[200px_1fr_120px_120px] grid-cols-[100px_1fr_120px_120px] items-center gap-4">
                <chip :label="invoice?.supplier_number" />
                <div class="flex gap-5 items-center justify-center">
                  <div class="flex justify-end">
                    <chip icon="FlagTriangleRight" :label="formatDate(invoice?.invoice_date)" />
                  </div>
                  <div class="relative w-0.5 h-5 rounded-full bg-[#EDEDED]"></div>
                  <div class="flex justify-start">
                    <chip icon="Clock4" :label="formatDate(invoice?.due_date)" />
                  </div>
                </div>
                <div class="flex justify-end">
                  <chip :label="formatCurrency(invoice?.amount)" />
                </div>
                <div class="flex justify-end">
                  <badge :variant="getInvoiceStatusVariant(invoice?.status)" :label="getInvoiceStatusLabel(invoice?.status)" />
                </div>
              </div>
            </cardRow>
          </div>
        </div>
      </shelf>
    </div>
  </mainView>
</template>

<script>
import { auth } from '../data/auth';
import { store } from '../data/store';
import { datadb } from '../data/datadb';
import { getInvoiceById } from '../api/invoices';
import { getInvoiceStatusVariant, getInvoiceStatusLabel, formatDate, formatCurrency } from '../utils/format';

import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';
import tlButton from '../components/button/tl-button.vue';
import shelf from '../components/shelf/shelf.vue';
import cardInfo from '../components/card/card-info.vue';
import cardRow from '../components/card/card-row.vue';
import tlAvatar from '../components/avatar/tl-avatar.vue';
import chip from '../components/chip/chip.vue';
import badge from '../components/badge/badge.vue';

// ICONS
import { ChartLine, Files } from '@lucide/vue';

export default {
  name: 'Home',
  components: {
    sidebar,
    mainView,
    tlButton,
    shelf,
    cardInfo,
    cardRow,
    tlAvatar,
    chip,
    badge,

    // ICONS
    ChartLine,
    Files,
  },
  data() {
    return {
      auth,
      store,
      datadb,
    };
  },
  computed: {
    newInvoiceHead() {
      if (!this.store.modals.newInvoice.data.file.analysisType) {
        return 'Scegli metodo di analisi file';
      }

      return 'Analizza fattura';
    },
  },
  methods: {
    getInvoiceStatusVariant,
    getInvoiceStatusLabel,
    formatDate,
    formatCurrency,

    async handleInvoice(invoiceId) {
      if (!invoiceId) return;

      this.$router.push({ name: 'invoice', params: { id: invoiceId } });
      await getInvoiceById(invoiceId);
    },
  },
};
</script>

<style scoped></style>
