<template>
  <sidebar />
  <mainView>
    <div v-if="!invoice.loading && !invoice.error" class="w-full h-11 flex items-center">
      <RouterLink to="/">
        <tlIconButton size="extra-small" icon="ChevronLeft" class="mr-2" />
      </RouterLink>
      <h1 class="text-black text-2xl font-semibold max-one-line">{{ invoice.data?.supplier_name }}</h1>
      <div v-if="!store.windowOptions.isMobile" class="ml-auto flex gap-2 items-center">
        <tlButton
          v-if="invoice.data?.file_url"
          @click="previewIsVisible = !previewIsVisible"
          size="small"
          variant="tertiary"
          :leftIcon="previewIsVisible ? 'EyeClosed' : 'Eye'"
          :label="previewIsVisible ? 'Nascondi Anteprima' : 'Mostra Anteprima'"
        />
        <tlButton size="small" variant="tertiary" leftIcon="Pen" label="Modifica" />
        <tlButton
          v-if="invoice.data?.status !== 'paid'"
          @click="handleMarkInvoiceAsPaid(invoice.data?.id)"
          size="small"
          leftIcon="BanknoteArrowUp"
          label="Segna come pagata"
        />
        <tlButton
          v-if="invoice.data?.status === 'paid'"
          @click="handleMarkInvoiceAsUnpaid(invoice.data?.id)"
          size="small"
          leftIcon="BanknoteX"
          label="Segna come non pagata"
        />
      </div>
      <div v-else-if="store.windowOptions.isMobile" class="ml-auto">
        <dropdown>
          <template #trigger>
            <tlIconButton size="small" icon="EllipsisVertical" />
          </template>
          <template #options>
            <dropdownItem
              v-if="invoice.data?.file_url"
              @click="previewIsVisible = !previewIsVisible"
              :icon="previewIsVisible ? 'EyeClosed' : 'Eye'"
              :label="previewIsVisible ? 'Nascondi Anteprima' : 'Mostra Anteprima'"
            />
            <dropdownItem icon="Pen" label="Modifica" />
            <dropdownItem
              v-if="invoice.data?.status !== 'paid'"
              @click="handleMarkInvoiceAsPaid(invoice.data?.id)"
              icon="BanknoteArrowUp"
              label="Segna come pagata"
            />
            <dropdownItem
              v-if="invoice.data?.status === 'paid'"
              @click="handleMarkInvoiceAsUnpaid(invoice.data?.id)"
              icon="BanknoteX"
              label="Segna come non pagata"
            />
          </template>
        </dropdown>
      </div>
    </div>

    <div
      v-if="!invoice.loading && !invoice.error"
      class="w-full mt-8 grid gap-6 pb-12"
      :class="{ 'lg:grid-cols-2': previewIsVisible && invoice.data?.file_url }"
    >
      <div class="w-full flex flex-col gap-6">
        <!-- Status & Amount Card -->
        <div class="p-5 rounded-[24px] border border-black/5 bg-white flex flex-col gap-4">
          <div class="flex justify-between items-start">
            <div class="flex flex-col">
              <span class="text-[#212121]/50 text-xs font-normal uppercase tracking-wider">Totale Fattura</span>
              <h2 class="text-4xl font-bold text-black mt-1">{{ formatCurrency(invoice.data?.amount) }}</h2>
            </div>
            <badge :variant="getInvoiceStatusVariant(invoice.data?.status)" :label="getInvoiceStatusLabel(invoice.data?.status)" />
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-black/5">
            <div class="flex flex-col gap-1">
              <span class="text-[#212121]/50 text-xs font-normal">Data Emissione</span>
              <div class="flex items-center gap-2 text-sm font-medium text-black">
                <Calendar size="16" class="text-[#212121]/50" />
                {{ formatDate(invoice.data?.invoice_date) }}
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[#212121]/50 text-xs font-normal">Data Scadenza</span>
              <div class="flex items-center gap-2 text-sm font-medium" :class="isOverdue ? 'text-red-500' : 'text-black'">
                <Clock4 size="16" class="text-[#212121]/50" />
                {{ formatDate(invoice.data?.due_date) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Supplier & Payment Details -->
        <div class="p-5 rounded-[24px] border border-black/5 bg-white flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-[#212121]/50 uppercase tracking-wider">
                <Hash size="14" />
                Numero Fattura
              </div>
              <p class="text-base font-medium text-black">{{ invoice.data?.supplier_number || 'N/D' }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2 text-xs font-semibold text-[#212121]/50 uppercase tracking-wider">
                <CreditCard size="14" />
                Dati Bancari
              </div>
              <p class="text-base font-medium text-black whitespace-pre-wrap">{{ invoice.data?.bank_account_details || 'N/D' }}</p>
            </div>
          </div>

          <div v-if="invoice.data?.notes" class="flex flex-col gap-2 pt-4 border-t border-black/5">
            <div class="flex items-center gap-2 text-xs font-semibold text-[#212121]/50 uppercase tracking-wider">
              <FileText size="14" />
              Note
            </div>
            <p class="text-sm text-black/70 leading-relaxed whitespace-pre-wrap">{{ invoice.data?.notes }}</p>
          </div>
        </div>

        <!-- Invoice Items -->
        <div v-if="invoice.data?.invoice_items?.length" class="flex flex-col gap-4">
          <h3 class="text-lg font-semibold text-black px-1">Articoli</h3>
          <div class="flex flex-col gap-1">
            <div
              v-for="item in invoice.data.invoice_items"
              :key="item.id"
              class="p-4 rounded-[20px] border border-black/5 bg-white flex justify-between items-center"
            >
              <div class="flex flex-col gap-1">
                <span class="text-sm font-semibold text-black">{{ item.description }}</span>
                <span class="text-xs text-[#212121]/50">{{ item.quantity }} x {{ formatCurrency(item.unit_cost) }}</span>
              </div>
              <span class="text-sm font-bold text-black">{{ formatCurrency(item.amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Financial Breakdown -->
        <div class="mt-4 p-6 rounded-[24px] bg-[#F5F5F5] border border-black/5 flex flex-col gap-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-[#212121]/50">Imponibile</span>
            <span class="font-medium text-black">{{ formatCurrency(subtotal) }}</span>
          </div>
          <div v-if="invoice.data?.tax" class="flex justify-between items-center text-sm">
            <span class="text-[#212121]/50">IVA</span>
            <span class="font-medium text-black">{{ invoice.data.tax }}%</span>
          </div>
          <div v-if="invoice.data?.shipping_fee" class="flex justify-between items-center text-sm">
            <span class="text-[#212121]/50">Spedizione</span>
            <span class="font-medium text-black">{{ formatCurrency(invoice.data.shipping_fee) }}</span>
          </div>
          <div v-if="invoice.data?.discount" class="flex justify-between items-center text-sm text-red-500">
            <span>Sconto</span>
            <span class="font-medium">-{{ formatCurrency(invoice.data.discount) }}</span>
          </div>
        </div>
      </div>
      <!-- RIGHT COLUMN: PDF Preview -->
      <div
        v-if="previewIsVisible && invoice.data?.file_url"
        class="w-full h-[calc(100vh-120px)] lg:sticky lg:top-8 rounded-[24px] border border-black/5 overflow-hidden"
      >
        <iframe :src="invoice.data?.file_url" frameborder="0" class="w-full h-full"></iframe>
      </div>
    </div>

    <div v-else-if="invoice.loading && !invoice.error" class="w-full py-8 flex items-center justify-center">
      <loader />
    </div>

    <div v-else-if="invoice.error" class="w-full h-svh flex flex-col items-center justify-center text-center">
      <h2 class="text-xl font-semibold">Fattura non trovata</h2>
      <p class="text-gray-500 text-sm font-normal mt-1">Spiacenti, questa fattura non esiste.</p>
      <RouterLink to="/" class="mt-6">
        <tlButton size="small" variant="secondary" label="Indietro" />
      </RouterLink>
    </div>
  </mainView>
</template>

<script>
import { datadb } from '../../data/datadb';
import { store } from '../../data/store';
import { getInvoices, getInvoiceById, markInvoiceAsPaidById, markInvoiceAsUnpaidById } from '../../api/invoices';
import { getInvoiceStatusVariant, getInvoiceStatusLabel, formatDate, formatCurrency } from '../../utils/format';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import loader from '../../components/global/loader.vue';
import tlButton from '../../components/button/tl-button.vue';
import tlIconButton from '../../components/button/tl-icon-button.vue';
import dropdown from '../../components/dropdown/dropdown.vue';
import dropdownItem from '../../components/dropdown/dropdown-item.vue';
import badge from '../../components/badge/badge.vue';

// ICONS
import { Calendar, Clock4, CreditCard, FileText, Hash } from '@lucide/vue';

export default {
  name: 'Invoice',
  components: {
    sidebar,
    mainView,
    loader,
    tlButton,
    tlIconButton,
    dropdown,
    dropdownItem,
    badge,

    // ICONS
    Calendar,
    Clock4,
    CreditCard,
    FileText,
    Hash,
  },
  data() {
    return {
      store,
      invoice: datadb.invoice,

      invoiceId: this.$route.params.id,
      previewIsVisible: true,
    };
  },
  computed: {
    isOverdue() {
      if (!this.invoice.data?.due_date) return false;
      if (this.invoice.data.status === 'paid') return false;
      return new Date(this.invoice.data.due_date) < new Date();
    },
    subtotal() {
      if (!this.invoice.data?.invoice_items) return 0;
      return this.invoice.data.invoice_items.reduce((acc, item) => acc + (item.amount || 0), 0);
    },
  },
  methods: {
    formatDate,
    formatCurrency,
    getInvoiceStatusVariant,
    getInvoiceStatusLabel,

    async getInvoice() {
      if (!this.invoiceId) return;

      try {
        await getInvoiceById(this.invoiceId);
        await getInvoices();
        this.invoice = datadb.invoice;
      } catch (error) {
        console.error(error);
      }
    },
    async handleMarkInvoiceAsPaid(invoiceId) {
      if (!invoiceId) return;

      if (confirm('Sei sicuro di voler segnalare questa fattura come pagata?')) {
        await markInvoiceAsPaidById(invoiceId);
        await this.getInvoice();
      }
    },
    async handleMarkInvoiceAsUnpaid(invoiceId) {
      if (!invoiceId) return;

      if (confirm('Sei sicuro di voler segnalare questa fattura come non pagata?')) {
        await markInvoiceAsUnpaidById(invoiceId);
        await this.getInvoice();
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler(value) {
        if (value) {
          this.getInvoice();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
