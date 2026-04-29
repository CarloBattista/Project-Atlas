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
      <div>
        <tlInputFile v-model="store.modals.newInvoice.data.file.selectedFile" accepts=".pdf" />
        <div class="mt-6 flex flex-col gap-4">
          <div v-if="store.modals.newInvoice.data.file.error" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {{ store.modals.newInvoice.data.file.error }}
          </div>
          <progressBar v-if="store.modals.newInvoice.data.file.loading" :progress="store.modals.newInvoice.data.file.progress" />
        </div>
      </div>
    </template>
    <template #actions>
      <tlButton
        @click="processInvoice"
        class="w-full"
        label="Analizza e Salva Fattura"
        :loading="loading"
        :disabled="!store.modals.newInvoice.data.file.selectedFile || store.modals.newInvoice.data.file.loading"
      />
    </template>
  </modal>
</template>

<script>
import { auth } from '../data/auth';
import { store } from '../data/store';

import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';
import tlButton from '../components/button/tl-button.vue';
import modal from '../components/modal/modal.vue';
import tlInputFile from '../components/input/tl-input-file.vue';
import progressBar from '../components/progress/progress-bar.vue';

export default {
  name: 'Home',
  components: {
    sidebar,
    mainView,
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
      const key = this.store.modals.newInvoice.data.file;

      if (!key.selectedFile) return;

      key.loading = true;
      key.error = null;
      key.progress = 0;

      try {
        key.loadingStatus = 'Preparazione file...';
        key.progress = 20;
        await new Promise((r) => setTimeout(r, 800));

        key.loadingStatus = 'Analisi IA in corso...';
        key.progress = 60;
        await new Promise((r) => setTimeout(r, 1200));

        key.loadingStatus = 'Salvataggio dati...';
        key.progress = 90;
        await new Promise((r) => setTimeout(r, 800));

        key.progress = 100;
        this.store.modals.newInvoice.isOpen = false;
        this.store.modals.newInvoice.data.file.selectedFile = null;
        alert('Fattura elaborata con successo!');
      } catch (err) {
        key.error = 'Errore durante elaborazione della fattura.';
        console.error(err);
      } finally {
        key.loading = false;
      }
    },
  },
};
</script>

<style scoped></style>
