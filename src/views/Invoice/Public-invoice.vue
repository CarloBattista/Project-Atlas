<template>
  <div class="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <appLogo type="logo" variant="pulse" class="relative h-5" />
        <div v-if="invoice" class="text-right">
          <badge :variant="getInvoiceStatusVariant(invoice.status)" :label="getInvoiceStatusLabel(invoice.status)" />
        </div>
      </div>

      <div v-if="loading" class="w-full py-20 flex items-center justify-center">
        <loader />
      </div>

      <div v-else-if="error" class="bg-white p-12 rounded-[32px] border border-black/5 text-center shadow-sm">
        <h2 class="text-2xl font-bold text-black mb-2">Fattura non trovata</h2>
        <p class="text-gray-500 mb-8">Il link potrebbe essere scaduto o non valido.</p>
      </div>

      <div v-else-if="invoice" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Details -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <!-- Main Info Card -->
          <div class="bg-white p-6 sm:p-8 rounded-[32px] border border-black/5 shadow-sm">
            <div class="flex flex-col sm:flex-row justify-between gap-6 mb-8">
              <div>
                <span class="text-xs font-bold text-black/40 uppercase tracking-widest">Da</span>
                <h2 class="text-2xl font-bold text-black mt-1">{{ invoice.supplier_name }}</h2>
              </div>
              <div class="sm:text-right">
                <span class="text-xs font-bold text-black/40 uppercase tracking-widest">Fattura n°</span>
                <p class="text-lg font-bold text-black mt-1">{{ invoice.supplier_number || 'N/D' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8 py-8 border-y border-black/5">
              <div>
                <span class="text-xs font-bold text-black/40 uppercase tracking-widest block mb-2">Data Emissione</span>
                <div class="flex items-center gap-2 text-black font-semibold">
                  <Calendar size="18" class="text-black/20" />
                  {{ formatDate(invoice.invoice_date) }}
                </div>
              </div>
              <div>
                <span class="text-xs font-bold text-black/40 uppercase tracking-widest block mb-2">Scadenza</span>
                <div class="flex items-center gap-2 font-semibold" :class="isOverdue ? 'text-red-500' : 'text-black'">
                  <Clock4 size="18" class="text-black/20" />
                  {{ formatDate(invoice.due_date) }}
                </div>
              </div>
            </div>

            <!-- Items Table -->
            <div class="mt-8">
              <h3 class="text-sm font-bold text-black/40 uppercase tracking-widest mb-4">Dettagli Articoli</h3>
              <div class="flex flex-col gap-3">
                <div
                  v-for="item in invoice.invoice_items"
                  :key="item.id"
                  class="flex justify-between items-center p-4 rounded-2xl bg-[#F8F9FA] border border-black/3"
                >
                  <div>
                    <p class="font-bold text-black">{{ item.description }}</p>
                    <p class="text-xs text-black/50">{{ item.quantity }} x {{ formatCurrency(item.unit_cost) }}</p>
                  </div>
                  <p class="font-bold text-black">{{ formatCurrency(item.amount) }}</p>
                </div>
              </div>
            </div>

            <!-- Financial Summary -->
            <div class="mt-8 pt-8 border-t border-black/5 flex flex-col gap-4">
              <div class="flex justify-between items-center text-sm">
                <span class="text-black/50 font-medium">Subtotale</span>
                <span class="text-black font-bold">{{ formatCurrency(subtotal) }}</span>
              </div>
              <div v-if="invoice.tax" class="flex justify-between items-center text-sm">
                <span class="text-black/50 font-medium">IVA ({{ invoice.tax }}%)</span>
                <span class="text-black font-bold">{{ formatCurrency(taxAmount) }}</span>
              </div>
              <div v-if="invoice.shipping_fee" class="flex justify-between items-center text-sm">
                <span class="text-black/50 font-medium">Spedizione</span>
                <span class="text-black font-bold">{{ formatCurrency(invoice.shipping_fee) }}</span>
              </div>
              <div v-if="invoice.discount" class="flex justify-between items-center text-sm text-red-500">
                <span class="font-medium">Sconto</span>
                <span class="font-bold">-{{ formatCurrency(invoice.discount) }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-black/5 mt-2">
                <span class="text-lg font-bold text-black">Totale</span>
                <span class="text-3xl font-black text-black">{{ formatCurrency(invoice.amount) }}</span>
              </div>
            </div>
          </div>

          <!-- Bank Details & Notes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="invoice.bank_account_details" class="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
              <h3 class="text-xs font-bold text-black/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                <CreditCard size="14" /> Coordinate Bancarie
              </h3>
              <p class="text-sm font-semibold text-black whitespace-pre-wrap">{{ invoice.bank_account_details }}</p>
            </div>
            <div v-if="invoice.notes" class="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
              <h3 class="text-xs font-bold text-black/40 uppercase tracking-widest mb-3 flex items-center gap-2"><FileText size="14" /> Note</h3>
              <p class="text-sm text-black/60 leading-relaxed">{{ invoice.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Actions & Preview -->
        <div class="flex flex-col gap-6">
          <div class="bg-black p-8 rounded-[32px] text-white shadow-lg">
            <h3 class="text-lg font-bold mb-4">Azioni</h3>
            <div class="flex flex-col gap-3">
              <a :href="invoice.file_url" class="w-full">
                <tlButton size="large" variant="primary" leftIcon="Download" label="Scarica PDF" class="w-full" />
              </a>
              <tlButton @click="handlePrint" size="large" variant="tertiary" leftIcon="Printer" label="Stampa" />
            </div>
          </div>

          <div v-if="invoice.file_url" class="bg-white p-2 rounded-[32px] border border-black/5 shadow-sm overflow-hidden aspect-[1/1.4]">
            <iframe :src="invoice.file_url" class="w-full h-full rounded-[24px]" frameborder="0"></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../../lib/supabase';
import { formatDate, formatCurrency, getInvoiceStatusVariant, getInvoiceStatusLabel } from '../../utils/format';

import appLogo from '../../components/global/app-logo.vue';
import loader from '../../components/global/loader.vue';
import badge from '../../components/badge/badge.vue';
import tlButton from '../../components/button/tl-button.vue';

// ICONS
import { Calendar, Clock4, CreditCard, FileText } from '@lucide/vue';

export default {
  name: 'Public-invoice',
  components: {
    appLogo,
    loader,
    badge,
    tlButton,

    // ICONS
    Calendar,
    Clock4,
    CreditCard,
    FileText,
  },
  data() {
    return {
      invoice: null,
      loading: true,
      error: null,
    };
  },
  computed: {
    isOverdue() {
      if (!this.invoice?.due_date) return false;
      if (this.invoice.status === 'paid') return false;
      return new Date(this.invoice.due_date) < new Date();
    },
    subtotal() {
      if (!this.invoice?.invoice_items) return 0;
      return this.invoice.invoice_items.reduce((acc, item) => acc + (item.amount || 0), 0);
    },
    taxAmount() {
      if (!this.invoice?.tax) return 0;
      return (this.subtotal * this.invoice.tax) / 100;
    },
  },
  methods: {
    formatDate,
    formatCurrency,
    getInvoiceStatusVariant,
    getInvoiceStatusLabel,
    handlePrint() {
      window.print();
    },
    async fetchInvoice() {
      const id = this.$route.params.id;
      if (!id) {
        this.loading = false;
        this.error = 'Missing invoice ID';
        return;
      }

      this.loading = true;
      try {
        const { data, error } = await supabase.from('invoices').select('*, invoice_items(*)').eq('id', id).single();

        if (error) throw error;
        this.invoice = data;
      } catch (e) {
        console.error('Error fetching public invoice:', e);
        this.error = e.message || 'Invoice not found';
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchInvoice();
  },
};
</script>

<style scoped></style>
