<template>
  <sidebar />
  <mainView>
    <div class="w-full h-11 flex items-center">
      <h1 v-if="auth.profile" class="text-black text-2xl font-semibold">Bentornato, {{ auth.profile?.first_name }}!</h1>
      <div class="ml-auto flex gap-2 items-center">
        <tlIconButton @click="store.searchBar.isOpen = true" size="small" variant="tertiary" icon="SearchIcon" />
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
              firstLabel="Fatture Totali"
              :head="datadb.invoices.totalCount + ' ' + 'Fatture'"
              description="Totale delle fatture caricate"
              icon="Files"
              bottomLabel="Aggiornato in tempo reale"
              class="w-full"
            />
            <cardInfo
              firstLabel="Importo Totale"
              :head="formatCurrency(getTotalInvoicesAmount(datadb.invoices.data))"
              description="Valore totale delle fatture"
              icon="Zap"
              bottomLabel="IVA inclusa"
              class="w-full"
            />
            <cardInfo
              firstLabel="Importo Pagato"
              :head="formatCurrency(getPaidInvoicesAmount(datadb.invoices.data))"
              description="Totale incassato finora"
              icon="Check"
              bottomLabel="Fatture con stato 'Pagata'"
              class="w-full"
            />
            <cardInfo
              firstLabel="Clienti Totali"
              :head="(datadb.clients.data ? datadb.clients.data.length : 0) + ' ' + 'Clienti'"
              description="Clienti registrati nel database"
              icon="Users"
              bottomLabel="Gestione clienti attiva"
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
          <div
            v-if="!datadb.invoices?.loading && datadb.invoices?.data.length === 0"
            class="w-full my-14 flex flex-col items-center justify-center text-center"
          >
            <h2 class="text-xl font-semibold">Al momento non ci sono fatture</h2>
            <p class="text-gray-500 text-sm font-normal mt-1">Non hai creato fatture ancora.</p>
          </div>
          <div v-else-if="!datadb.invoices?.loading && datadb.invoices?.data.length >= 1" class="w-full flex flex-col gap-1">
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

            <!-- PAGINATION -->
            <div
              v-if="totalPages > 1 || datadb.invoices.totalCount > 10"
              class="w-full mt-4 flex items-center justify-between border-t border-[#EDEDED] pt-4"
            >
              <div class="flex items-center gap-4">
                <span class="text-[#656565] text-sm"> Pagina {{ currentPage }} di {{ totalPages }} </span>
                <div class="flex items-center gap-2">
                  <span class="text-[#656565] text-sm">Mostra:</span>
                  <select v-model="itemsPerPage" class="bg-[#F5F5F5] border-none rounded-lg text-sm px-2 py-1 outline-none cursor-pointer">
                    <option :value="10">10</option>
                    <option :value="15">15</option>
                    <option :value="20">20</option>
                  </select>
                </div>
              </div>
              <div class="flex gap-2 items-center">
                <tlButton
                  size="small"
                  :variant="currentPage === 1 ? 'tertiary' : 'primary'"
                  leftIcon="ChevronLeft"
                  label=""
                  :disabled="currentPage === 1 || datadb.invoices.loading"
                  @click="currentPage--"
                />
                <tlButton
                  size="small"
                  :variant="currentPage === totalPages ? 'tertiary' : 'primary'"
                  rightIcon="ChevronRight"
                  label=""
                  :disabled="currentPage === totalPages || datadb.invoices.loading"
                  @click="currentPage++"
                />
              </div>
            </div>
          </div>
          <div v-else-if="datadb.invoices?.loading" class="w-full my-14 flex items-center justify-center">
            <loader />
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
import { getInvoices } from '../api/invoices';
import { getInvoiceStatusVariant, getInvoiceStatusLabel, formatDate, formatCurrency } from '../utils/format';
import { getTotalInvoicesCount, getTotalInvoicesAmount, getPaidInvoicesAmount, getUniqueSuppliersCount } from '../utils/analytics';

import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';
import loader from '../components/global/loader.vue';
import tlButton from '../components/button/tl-button.vue';
import tlIconButton from '../components/button/tl-icon-button.vue';
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
    loader,
    tlButton,
    tlIconButton,
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

      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  computed: {
    newInvoiceHead() {
      if (!this.store.modals.newInvoice.data.file.analysisType) {
        return 'Scegli metodo di analisi file';
      }

      return 'Analizza fattura';
    },

    totalPages() {
      if (!this.datadb.invoices.totalCount) return 0;
      return Math.ceil(this.datadb.invoices.totalCount / this.itemsPerPage);
    },
  },
  methods: {
    getInvoiceStatusVariant,
    getInvoiceStatusLabel,
    formatDate,
    formatCurrency,
    getTotalInvoicesCount,
    getTotalInvoicesAmount,
    getPaidInvoicesAmount,
    getUniqueSuppliersCount,

    async handleInvoice(invoiceId) {
      if (!invoiceId) return;

      this.$router.push({ name: 'invoice', params: { id: invoiceId } });
    },
  },
  watch: {
    currentPage() {
      getInvoices(this.currentPage, this.itemsPerPage);
    },
    itemsPerPage() {
      this.currentPage = 1;
      getInvoices(this.currentPage, this.itemsPerPage);
    },
  },
};
</script>

<style scoped></style>
