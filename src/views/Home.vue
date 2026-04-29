<template>
  <sidebar />
  <mainView>
    <div class="w-full flex items-center">
      <h1 v-if="auth.profile" class="text-black text-2xl font-semibold">Bentornato, {{ auth.profile?.first_name }}!</h1>
      <div class="ml-auto flex gap-2 items-center">
        <tlButton @click="store.modals.newInvoice.isOpen = true" size="small" variant="tertiary" leftIcon="Plus" label="Nuova fattura" />
      </div>
    </div>
  </mainView>
  <modal modalKey="newInvoice" head="Nuova fattura">
    <template #body>
      <div v-if="!store.modals.newInvoice.data.file.invoiceAnalysis" class="w-full">
        <tlInputFile v-model="store.modals.newInvoice.data.file.selectedFile" accepts=".pdf" />
        <div class="mt-6 flex flex-col gap-4">
          <div v-if="store.modals.newInvoice.data.file.error" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {{ store.modals.newInvoice.data.file.error }}
          </div>
          <progressBar v-if="store.modals.newInvoice.data.file.loading" :progress="store.modals.newInvoice.data.file.progress" />
        </div>
      </div>
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
        @click="processInvoice"
        class="w-full"
        label="Analizza fattura"
        :loading="loading"
        :disabled="!store.modals.newInvoice.data.file.selectedFile || store.modals.newInvoice.data.file.loading"
      />
    </template>
  </modal>
</template>

<script>
import { auth } from '../data/auth';
import { store } from '../data/store';
import { analyzeInvoice } from '../utils/invoiceParser';

import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';
import tlInput from '../components/input/tl-input.vue';
import tlButton from '../components/button/tl-button.vue';
import modal from '../components/modal/modal.vue';
import tlInputFile from '../components/input/tl-input-file.vue';
import progressBar from '../components/progress/progress-bar.vue';

export default {
  name: 'Home',
  components: {
    sidebar,
    mainView,
    tlInput,
    tlButton,
    modal,
    tlInputFile,
    progressBar,
  },
  data() {
    return {
      auth,
      store,
    };
  },
  methods: {
    async processInvoice() {
      const modalData = this.store.modals.newInvoice.data;
      const key = modalData.file;

      if (!key.selectedFile) return;

      key.invoiceAnalysis = null;
      key.loading = true;
      key.error = null;
      key.progress = 0;

      try {
        key.loadingStatus = 'Lettura PDF...';
        key.progress = 20;

        // Analisi reale del file
        const analysisResults = await analyzeInvoice(key.selectedFile.file);

        key.loadingStatus = 'Estrazione dati...';
        key.progress = 60;
        await new Promise((r) => setTimeout(r, 500)); // Breve attesa per UX

        // Popoliamo i campi dello store con i risultati
        modalData.supplier_name = analysisResults.supplier_name;
        modalData.supplier_number = analysisResults.supplier_number;
        modalData.amount = analysisResults.amount;
        modalData.currency = analysisResults.currency;
        modalData.invoice_date = analysisResults.invoice_date;
        modalData.due_date = analysisResults.due_date;

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
