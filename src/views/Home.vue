<template>
  <sidebar />
  <mainView>
    <div class="w-full h-11 flex items-center">
      <h1 v-if="auth.profile" class="text-black text-2xl font-semibold">Bentornato, {{ auth.profile?.first_name }}!</h1>
      <div class="ml-auto flex gap-2 items-center">
        <tlButton @click="openNewInvoiceModal" size="small" variant="tertiary" leftIcon="Plus" label="Nuova fattura" />
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
          <div class="w-full flex flex-col gap-1">
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
  <modal modalKey="newInvoice" :head="newInvoiceHead" :actions="store.modals.newInvoice.data.file.analysisType">
    <template #back>
      <tlIconButton
        v-if="store.modals.newInvoice.data.file.analysisType"
        @click="store.modals.newInvoice.data.file.analysisType = null"
        size="extra-small"
        icon="ChevronLeft"
      />
    </template>
    <template #body>
      <!-- Step 0: Scelta tipo analisi -->
      <div v-if="!store.modals.newInvoice.data.file.analysisType" class="w-full flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <button
            @click="store.modals.newInvoice.data.file.analysisType = 'local'"
            class="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-100 hover:border-black hover:bg-black/5 transition-all text-left cursor-pointer"
          >
            <div class="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Cpu :size="24" />
            </div>
            <div class="text-center">
              <p class="font-semibold text-gray-900">Analisi Locale</p>
              <p class="text-xs text-gray-500 mt-1">Veloce e privata, elaborata sul tuo browser.</p>
            </div>
          </button>

          <button
            @click="store.modals.newInvoice.data.file.analysisType = 'ai'"
            class="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-100 hover:border-black hover:bg-black/5 transition-all text-left cursor-pointer"
          >
            <div class="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <Zap :size="24" />
            </div>
            <div class="text-center">
              <p class="font-semibold text-gray-900">Analisi AI</p>
              <p class="text-xs text-gray-500 mt-1">Massima precisione grazie all'intelligenza artificiale.</p>
            </div>
          </button>
        </div>
      </div>
      <!-- Step 1: Caricamento File -->
      <div v-else-if="!store.modals.newInvoice.data.file.invoiceAnalysis" class="w-full">
        <tlInputFile v-model="store.modals.newInvoice.data.file.selectedFile" accepts=".pdf" />
        <div class="mt-6 flex flex-col gap-4">
          <div v-if="store.modals.newInvoice.data.file.error" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {{ store.modals.newInvoice.data.file.error }}
          </div>
          <progressBar v-if="store.modals.newInvoice.data.file.loading" :progress="store.modals.newInvoice.data.file.progress" />
          <p v-if="store.modals.newInvoice.data.file.loading" class="text-center text-xs text-gray-500">
            {{ store.modals.newInvoice.data.file.loadingStatus }}
          </p>
        </div>
      </div>
      <!-- Step 2: Risultati -->
      <div v-else-if="store.modals.newInvoice.data.file.invoiceAnalysis" class="w-full flex flex-col gap-4">
        <div class="w-full flex gap-2 items-center">
          <tlInput v-model="store.modals.newInvoice.data.supplier_number" label="Numero di fattura" class="w-full" />
          <tlInput v-model="store.modals.newInvoice.data.supplier_name" label="Nome cliente" class="w-full" />
        </div>
        <div class="w-full flex gap-2 items-center">
          <tlInput v-model="store.modals.newInvoice.data.currency" label="Valuta" class="w-[40%]" />
          <tlInput v-model="store.modals.newInvoice.data.amount" label="Totale" class="w-full" />
        </div>
        <div class="w-full flex gap-2 items-center">
          <tlInput v-model="store.modals.newInvoice.data.invoice_date" type="date" label="Data della fattura" class="w-full" />
          <tlInput v-model="store.modals.newInvoice.data.due_date" type="date" label="Scadenza" class="w-full" />
        </div>
      </div>
    </template>
    <template #actions>
      <tlButton
        v-if="store.modals.newInvoice.data.file.analysisType"
        @click="processInvoice"
        class="w-full"
        label="Analizza fattura"
        :loading="store.modals.newInvoice.data.file.loading"
        :disabled="!store.modals.newInvoice.data.file.selectedFile || store.modals.newInvoice.data.file.loading"
      />
    </template>
  </modal>
  <modal modalKey="invoice" :head="datadb.invoice?.data?.supplier_name" :actions="true">
    <template #body>
      <div class="flex flex-col gap-6">
        <!-- 🔝 SUMMARY -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p class="text-sm text-gray-500">Numero fattura</p>
            <p class="text-base font-medium">
              {{ datadb.invoice?.data?.supplier_number || '-' }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Importo</p>
            <p class="text-lg font-semibold">
              {{ formatCurrency(datadb.invoice?.data?.amount) }}
            </p>
          </div>

          <div>
            <p class="text-sm text-gray-500">Stato</p>
            <badge :variant="getInvoiceStatusVariant(datadb.invoice?.data?.status)" :label="getInvoiceStatusLabel(datadb.invoice?.data?.status)" />
          </div>
        </div>
        <!-- 📅 DATE -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-xl border border-gray-200">
            <p class="text-sm text-gray-500">Data fattura</p>
            <p class="text-sm font-medium">
              {{ formatDate(datadb.invoice?.data?.invoice_date) }}
            </p>
          </div>

          <div class="p-4 rounded-xl border border-gray-200">
            <p class="text-sm text-gray-500">Scadenza</p>
            <p class="text-sm font-medium">
              {{ formatDate(datadb.invoice?.data?.due_date) }}
            </p>
          </div>
        </div>
        <!-- 🏢 INFO FORNITORE -->
        <div class="p-4 rounded-xl border border-gray-200 flex items-center gap-3">
          <tlAvatar size="medium" :fallback="datadb.invoice?.data?.supplier_name?.charAt(0)" />
          <div>
            <p class="text-sm text-gray-500">Fornitore</p>
            <p class="text-sm font-medium">
              {{ datadb.invoice?.data?.supplier_name }}
            </p>
          </div>
        </div>
        <!-- 🧾 DEBUG (temporaneo) -->
        <details class="text-xs text-gray-400">
          <summary class="cursor-pointer">Debug JSON</summary>
          <code class="block mt-2">
            {{ datadb.invoice?.data }}
          </code>
        </details>
      </div>
    </template>

    <template #actions>
      <div class="flex justify-between w-full">
        <tlButton @click="handleDeleteInvoice(datadb.invoice?.data?.id)" size="small" variant="destructive" label="Elimina" />
        <div class="flex gap-2">
          <tlButton
            v-if="datadb.invoice.data.status !== 'paid'"
            @click="handleMarkInvoiceAsPaid(datadb.invoice?.data?.id)"
            size="small"
            variant="primary"
            label="Segna come pagata"
          />
        </div>
      </div>
    </template>
  </modal>
</template>

<script>
import { auth } from '../data/auth';
import { store } from '../data/store';
import { datadb } from '../data/datadb';
import { analyzeInvoice, extractTextFromPDF } from '../utils/invoiceParser';
import { aiService } from '../utils/aiService';
import { getInvoices, getInvoiceById, deleteInvoiceById, markInvoiceAsPaidById } from '../api/invoices';
import { getInvoiceStatusVariant, getInvoiceStatusLabel, formatDate, formatCurrency } from '../utils/format';

import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';
import tlInput from '../components/input/tl-input.vue';
import tlButton from '../components/button/tl-button.vue';
import tlIconButton from '../components/button/tl-icon-button.vue';
import modal from '../components/modal/modal.vue';
import tlInputFile from '../components/input/tl-input-file.vue';
import progressBar from '../components/progress/progress-bar.vue';
import shelf from '../components/shelf/shelf.vue';
import cardInfo from '../components/card/card-info.vue';
import cardRow from '../components/card/card-row.vue';
import tlAvatar from '../components/avatar/tl-avatar.vue';
import chip from '../components/chip/chip.vue';
import badge from '../components/badge/badge.vue';

// ICONS
import { Cpu, Zap, ChartLine, Files } from '@lucide/vue';

export default {
  name: 'Home',
  components: {
    sidebar,
    mainView,
    tlInput,
    tlButton,
    tlIconButton,
    modal,
    tlInputFile,
    progressBar,
    shelf,
    cardInfo,
    cardRow,
    tlAvatar,
    chip,
    badge,

    // ICONS
    Cpu,
    Zap,
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

    openNewInvoiceModal() {
      // Reset dei dati della modale
      const modal = this.store.modals.newInvoice;
      modal.data.file.selectedFile = null;
      modal.data.file.invoiceAnalysis = null;
      modal.data.file.analysisType = null;
      modal.data.file.error = null;
      modal.data.file.loading = false;
      modal.data.file.progress = 0;
      modal.data.file.loadingStatus = '';

      // Reset campi dati
      modal.data.supplier_name = '';
      modal.data.supplier_number = '';
      modal.data.amount = '0';
      modal.data.currency = 'EUR';
      modal.data.invoice_date = new Date().toISOString().split('T')[0];
      modal.data.due_date = new Date().toISOString().split('T')[0];

      modal.isOpen = true;
    },

    async handleInvoice(invoiceId) {
      if (!invoiceId) return;

      await getInvoiceById(invoiceId);
      this.store.modals.invoice.isOpen = true;
      this.$router.push({ query: { invoice: invoiceId } });
    },
    async handleDeleteInvoice(invoiceId) {
      if (!invoiceId) return;

      if (confirm('Sei sicuro di voler eliminare la fattura?')) {
        await deleteInvoiceById(invoiceId);
        await getInvoices();
        this.store.modals.invoice.isOpen = false;
        this.store.modals.invoice.data = null;
        this.$router.push({ query: {} });
      }
    },
    async handleMarkInvoiceAsPaid(invoiceId) {
      if (!invoiceId) return;

      await markInvoiceAsPaidById(invoiceId);
      await getInvoices();
      await getInvoiceById(invoiceId);
    },
    async processInvoice() {
      const modalData = this.store.modals.newInvoice.data;
      const key = modalData.file;

      if (!key.selectedFile) return;

      key.invoiceAnalysis = null;
      key.loading = true;
      key.error = null;
      key.progress = 0;

      try {
        if (modalData.file.analysisType === 'local') {
          key.loadingStatus = 'Lettura PDF...';
          key.progress = 20;

          // Analisi reale del file (Locale)
          const analysisResults = await analyzeInvoice(key.selectedFile.file);

          key.loadingStatus = 'Estrazione dati...';
          key.progress = 60;
          await new Promise((r) => setTimeout(r, 500));

          modalData.supplier_name = analysisResults.supplier_name;
          modalData.supplier_number = analysisResults.supplier_number;
          modalData.amount = analysisResults.amount;
          modalData.currency = analysisResults.currency;
          modalData.invoice_date = analysisResults.invoice_date;
          modalData.due_date = analysisResults.due_date;
        } else {
          // Analisi AI Reale
          key.loadingStatus = 'Lettura PDF...';
          key.progress = 10;
          const textContent = await extractTextFromPDF(key.selectedFile.file);

          key.loadingStatus = 'Analisi neurale in corso...';
          key.progress = 40;

          // Chiamata al servizio AI
          const analysisResults = await aiService.analyzeInvoiceWithAI(textContent);

          key.loadingStatus = 'Riconoscimento pattern...';
          key.progress = 80;
          await new Promise((r) => setTimeout(r, 500));

          modalData.supplier_name = analysisResults.supplier_name || 'Fornitore non trovato';
          modalData.supplier_number = analysisResults.supplier_number || '';
          modalData.amount = analysisResults.amount || '0';
          modalData.currency = analysisResults.currency || 'EUR';
          modalData.invoice_date = analysisResults.invoice_date || new Date().toISOString().split('T')[0];
          modalData.due_date = analysisResults.due_date || modalData.invoice_date;
        }

        key.loadingStatus = 'Completato!';
        key.progress = 100;
        key.invoiceAnalysis = true;
      } catch (err) {
        key.error = err.message || 'Errore durante elaborazione della fattura.';
        console.error(err);
      } finally {
        key.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
