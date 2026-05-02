<template>
  <sidebar />
  <mainView>
    <div class="w-full h-11 flex items-center">
      <RouterLink to="/">
        <tlIconButton size="extra-small" icon="ChevronLeft" class="mr-2" />
      </RouterLink>
      <h1 class="text-black text-2xl font-semibold max-one-line">Nuova Fattura</h1>
    </div>
    <div class="w-full mt-8">
      <div class="w-full max-w-[560px] mx-auto flex flex-col gap-6">
        <stepper :data="steps" />
        <div v-if="steps.current === 0" class="w-full mt-12">
          <div class="w-full mb-7 flex flex-col gap-2 items-center text-center">
            <h2 class="text-2xl font-semibold">Scegli la modalità di analisi</h2>
            <p class="text-gray-500 text-base font-normal">Scegli la modalità di analisi che preferisci.</p>
          </div>
          <div class="w-full flex flex-col gap-4">
            <cardOption
              @click="handleContinue(steps.current, 'ai')"
              :customIcon="true"
              :active="true"
              title="Analisi AI"
              description="Massima precisione grazie all'intelligenza artificiale."
            >
              <template #customIcon>
                <img src="/_resources/imgs/icon_ai.png" alt="ai mode" class="w-full h-full object-contain" />
              </template>
            </cardOption>
            <cardOption
              @click="handleContinue(steps.current, 'local')"
              :customIcon="true"
              title="Analisi Locale"
              description="Veloce e privata, elaborata sul tuo browser."
            >
              <template #customIcon>
                <img src="/_resources/imgs/icon_local.png" alt="local mode" class="w-full h-full object-contain" />
              </template>
            </cardOption>
          </div>
        </div>
        <div v-else-if="steps.current === 1" class="w-full mt-12">
          <tlInputFile v-model="dataInvoice.data.file.selectedFile" accepts=".pdf" />
          <div class="mt-6 flex flex-col gap-4">
            <div v-if="dataInvoice.data.file.error" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
              {{ dataInvoice.data.file.error }}
            </div>
            <progressBar v-if="dataInvoice.data.file.loading" :progress="dataInvoice.data.file.progress" />
            <p v-if="dataInvoice.data.file.loading" class="text-center text-xs text-gray-500">{{ dataInvoice.data.file.loadingStatus }}</p>
          </div>
          <tlButton @click="handleContinue(steps.current, null)" variant="primary" label="Analizza" class="w-full" />
        </div>
        <div v-else-if="steps.current === 2" class="w-full mt-12 pb-20">
          <div class="w-full mb-7 flex flex-col gap-2 items-center text-center">
            <h2 class="text-2xl font-semibold">Verifica i dati estratti</h2>
            <p class="text-gray-500 text-base font-normal">Controlla che i dati siano corretti prima di salvare la fattura.</p>
          </div>

          <div class="w-full flex flex-col gap-8">
            <!-- Gruppo 1: Fornitore -->
            <div class="flex flex-col gap-4">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Informazioni Fornitore</h3>
              <div class="flex flex-col gap-4">
                <div class="w-full flex gap-2">
                  <tlInput
                    v-model="dataInvoice.data.supplier_name"
                    label="Nome Fornitore"
                    placeholder="Inserisci il nome del fornitore"
                    class="w-full"
                  />
                  <tlInput v-model="dataInvoice.data.supplier_number" label="Numero Fattura" placeholder="Es: FATT-2024-001" class="w-full" />
                </div>
                <tlInput
                  v-model="dataInvoice.data.bank_account_details"
                  label="Dettagli Bancari (IBAN)"
                  placeholder="Inserisci IBAN o altri dettagli"
                />
              </div>
            </div>
            <!-- Gruppo 2: Date -->
            <div class="flex flex-col gap-4">
              <div class="w-full flex gap-2">
                <tlSelect
                  v-model="dataInvoice.data.currency"
                  label="Valuta"
                  :options="[
                    { label: 'EUR', value: 'EUR' },
                    { label: 'USD', value: 'USD' },
                    { label: 'GBP', value: 'GBP' },
                  ]"
                  class="w-full max-w-[20%]"
                />
                <tlInput v-model="dataInvoice.data.invoice_date" type="date" label="Data Fattura" class="w-full" />
                <tlInput v-model="dataInvoice.data.due_date" type="date" label="Data Scadenza" class="w-full" />
              </div>
            </div>
            <!-- Gruppo 3: Importi -->
            <div class="flex flex-col gap-4">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Dettagli Economici</h3>
              <div class="flex flex-col gap-4">
                <tlInput v-model="dataInvoice.data.tax" type="number" label="Tasse (%)" />
                <tlInput v-model="dataInvoice.data.shipping_fee" type="number" label="Spese Spedizione" />
                <tlInput v-model="dataInvoice.data.discount" type="number" label="Sconto" />
              </div>
            </div>
            <!-- Gruppo 4: Altro -->
            <div class="flex flex-col gap-4">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Note e Altro</h3>
              <tlInput v-model="dataInvoice.data.notes" label="Note" placeholder="Aggiungi eventuali note..." />
            </div>
            <tlButton @click="handleSave" variant="primary" label="Salva Fattura" class="w-full mt-4" :loading="dataInvoice.loading" />
          </div>
        </div>
      </div>
    </div>
  </mainView>
</template>

<script>
import { analyzeInvoice, extractTextFromPDF } from '../../utils/invoiceParser';
import { aiService } from '../../utils/aiService';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import stepper from '../../components/stepper/stepper.vue';
import cardOption from '../../components/card/card-option.vue';
import progressBar from '../../components/progress/progress-bar.vue';
import tlInputFile from '../../components/input/tl-input-file.vue';
import tlInput from '../../components/input/tl-input.vue';
import tlSelect from '../../components/input/tl-select.vue';
import tlButton from '../../components/button/tl-button.vue';

export default {
  name: 'New-invoice',
  components: {
    sidebar,
    mainView,
    stepper,
    cardOption,
    progressBar,
    tlInputFile,
    tlInput,
    tlSelect,
    tlButton,
  },
  data() {
    return {
      steps: {
        current: 0,
        total: 3,
      },

      dataInvoice: {
        data: {
          file: {
            selectedFile: null,
            error: null,
            loading: false,
            loadingStatus: '',
            progress: 0,
            invoiceAnalysis: null,
            analysisType: null, // 'local' o 'ai'
          },
          supplier_name: '',
          supplier_number: '',
          amount: '0',
          currency: 'EUR',
          invoice_date: new Date().toISOString().split('T')[0],
          due_date: new Date().toISOString().split('T')[0],
          bank_account_details: '',
          notes: '',
          tax: '',
          discount: '',
          shipping_fee: '',
        },
        errors: {},
        loading: false,
      },
    };
  },
  methods: {
    handleContinue(currentStep, analysisMode) {
      const stepSelectionMode = 0;
      const stepAnalysisiInvoice = 1;

      if (currentStep === stepSelectionMode) {
        this.steps.current++;
        this.dataInvoice.data.file.analysisType = analysisMode;
      } else if (currentStep === stepAnalysisiInvoice) {
        this.processInvoice();
      }
    },

    async processInvoice() {
      if (!this.dataInvoice.data.file.selectedFile) return;

      this.dataInvoice.data.file.invoiceAnalysis = null;
      this.dataInvoice.loading = true;
      this.dataInvoice.data.file.error = null;
      this.dataInvoice.data.file.progress = 0;

      try {
        if (this.dataInvoice.data.file.analysisType === 'local') {
          this.dataInvoice.data.file.loadingStatus = 'Lettura PDF...';
          this.dataInvoice.data.file.progress = 20;

          // Analisi reale del file (Locale)
          const analysisResults = await analyzeInvoice(this.dataInvoice.data.file.selectedFile.file);

          this.dataInvoice.data.file.loadingStatus = 'Estrazione dati...';
          this.dataInvoice.data.file.progress = 60;
          await new Promise((r) => setTimeout(r, 500));

          this.dataInvoice.data.supplier_name = analysisResults.supplier_name;
          this.dataInvoice.data.supplier_number = analysisResults.supplier_number;
          this.dataInvoice.data.amount = analysisResults.amount;
          this.dataInvoice.data.currency = analysisResults.currency;
          this.dataInvoice.data.invoice_date = analysisResults.invoice_date;
          this.dataInvoice.data.due_date = analysisResults.due_date;
          this.dataInvoice.data.tax = analysisResults.tax || '0';
          this.dataInvoice.data.discount = analysisResults.discount || '0';
          this.dataInvoice.data.shipping_fee = analysisResults.shipping_fee || '0';
          this.dataInvoice.data.bank_account_details = analysisResults.bank_account_details || '';
          this.dataInvoice.data.notes = analysisResults.notes || '';
        } else {
          // Analisi AI Reale
          this.dataInvoice.data.file.loadingStatus = 'Lettura PDF...';
          this.dataInvoice.data.file.progress = 10;
          const textContent = await extractTextFromPDF(this.dataInvoice.data.file.selectedFile.file);

          this.dataInvoice.data.file.loadingStatus = 'Analisi neurale in corso...';
          this.dataInvoice.data.file.progress = 40;

          // Chiamata al servizio AI
          const analysisResults = await aiService.analyzeInvoiceWithAI(textContent);

          this.dataInvoice.data.file.loadingStatus = 'Riconoscimento pattern...';
          this.dataInvoice.data.file.progress = 80;
          await new Promise((r) => setTimeout(r, 500));

          this.dataInvoice.data.supplier_name = analysisResults.supplier_name || 'Fornitore non trovato';
          this.dataInvoice.data.supplier_number = analysisResults.supplier_number || '';
          this.dataInvoice.data.amount = analysisResults.amount || '0';
          this.dataInvoice.data.currency = analysisResults.currency || 'EUR';
          this.dataInvoice.data.invoice_date = analysisResults.invoice_date || new Date().toISOString().split('T')[0];
          this.dataInvoice.data.due_date = analysisResults.due_date || this.dataInvoice.data.invoice_date;
          this.dataInvoice.data.tax = analysisResults.tax || '0';
          this.dataInvoice.data.discount = analysisResults.discount || '0';
          this.dataInvoice.data.shipping_fee = analysisResults.shipping_fee || '0';
          this.dataInvoice.data.bank_account_details = analysisResults.bank_account_details || '';
          this.dataInvoice.data.notes = analysisResults.notes || '';
        }

        this.dataInvoice.data.file.loadingStatus = 'Completato!';
        this.dataInvoice.data.file.progress = 100;
        this.dataInvoice.data.file.invoiceAnalysis = true;

        // Passa allo step successivo dopo un breve delay per far vedere il completamento
        setTimeout(() => {
          this.steps.current = 2;
        }, 800);
      } catch (err) {
        this.dataInvoice.data.file.error = err.message || 'Errore durante elaborazione della fattura.';
        console.error(err);
      } finally {
        this.dataInvoice.loading = false;
      }
    },

    handleSave() {
      this.dataInvoice.loading = true;
      // Simulazione salvataggio
      console.log('Salvataggio fattura:', this.dataInvoice.data);

      setTimeout(() => {
        this.dataInvoice.loading = false;
        this.$router.push('/');
      }, 1500);
    },
  },
};
</script>

<style scoped></style>
