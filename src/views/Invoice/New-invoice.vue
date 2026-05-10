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
              :customIcon="true"
              :active="true"
              class="opacity-50 cursor-not-allowed!"
              title="Analisi AI"
              description="Disponibile a breve (Usa Analisi Locale)."
            >
              <template #customIcon>
                <img src="/_resources/imgs/icon_ai.png" alt="ai mode" class="w-full h-full object-contain" />
              </template>
            </cardOption>
            <cardOption
              @click="handleContinue(steps.current, 'local')"
              :customIcon="true"
              :active="false"
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
          <tlButton @click="steps.current--" variant="secondary" label="Indietro" class="w-full mb-1" />
          <tlButton
            @click="handleContinue(steps.current, null)"
            variant="primary"
            label="Analizza"
            :disabled="!dataInvoice.data.file.selectedFile"
            class="w-full"
          />
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
                  <tlSelect v-model="dataInvoice.data.client_id" label="Associa a Cliente" :options="clientOptions" class="w-full" />
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
            <!-- Gruppo 4: Note e Altro -->
            <div class="flex flex-col gap-4">
              <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Note e Altro</h3>
              <tlInput v-model="dataInvoice.data.notes" label="Note" placeholder="Aggiungi eventuali note..." />
            </div>
            <!-- Gruppo 5: Item della Fattura -->
            <div class="flex flex-col gap-4">
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Articoli / Servizi</h3>
                <tlButton @click="addItem" size="small" variant="tertiary" label="Aggiungi Item" />
              </div>
              <div v-if="dataInvoice.data.items.length === 0" class="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <p class="text-gray-400 text-sm">Nessun articolo aggiunto. Clicca su "Aggiungi Item".</p>
              </div>
              <div v-for="(item, index) in dataInvoice.data.items" :key="index" class="relative flex flex-col gap-4">
                <div class="absolute -top-2 -right-2 z-10">
                  <tlIconButton @click="removeItem(index)" icon="X" size="extra-small" class="bg-red-500! text-white! hover:bg-red-600! shadow-sm" />
                </div>
                <div class="w-full flex gap-2">
                  <tlInput v-model="item.description" label="Descrizione" placeholder="Descrizione del servizio o prodotto" class="w-full" />
                  <tlInput v-model="item.quantity" type="number" label="Quantità" @input="calculateItemAmount(index)" class="w-full max-w-[25%]" />
                  <tlInput
                    v-model="item.unit_cost"
                    type="number"
                    label="Costo Unitario"
                    @input="calculateItemAmount(index)"
                    class="w-full max-w-[25%]"
                  />
                </div>
              </div>

              <!-- Totale Riepilogo -->
              <div class="mt-4 p-4 bg-black text-white rounded-xl flex justify-between items-center">
                <span class="text-sm font-medium">Totale Fattura</span>
                <span class="text-xl font-bold">{{ dataInvoice.data.amount }} {{ dataInvoice.data.currency }}</span>
              </div>
            </div>
            <div class="w-full mt-4 flex flex-col gap-1">
              <tlButton @click="steps.current--" variant="secondary" label="Indietro" class="w-full mb-1" />
              <tlButton
                @click="handleContinue(steps.current, null)"
                variant="primary"
                label="Salva Fattura"
                class="w-full"
                :loading="dataInvoice.loading"
              />
            </div>
          </div>
        </div>
        <div v-else class="w-full mt-12">
          <div class="w-full mb-7 flex flex-col gap-2 items-center text-center">
            <h2 class="text-2xl font-semibold">Hai aggiunto la fattura</h2>
            <p class="text-gray-500 text-base font-normal">La fattura è stata salvata con successo.</p>
          </div>
          <div class="w-full mt-4 flex flex-col gap-1">
            <tlButton @click="goToInvoice" variant="primary" label="Vai alla fattura" class="w-full" />
          </div>
        </div>
      </div>
    </div>
  </mainView>
</template>

<script>
import { analyzeInvoice, extractTextFromPDF } from '../../utils/invoiceParser';
import { aiService } from '../../utils/aiService';
import { createInvoice } from '../../api/invoices';
import { getClients } from '../../api/clients';
import { auth } from '../../data/auth';
import { datadb } from '../../data/datadb';
import { toast } from '../../utils/toast';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import stepper from '../../components/stepper/stepper.vue';
import cardOption from '../../components/card/card-option.vue';
import progressBar from '../../components/progress/progress-bar.vue';
import tlInputFile from '../../components/input/tl-input-file.vue';
import tlInput from '../../components/input/tl-input.vue';
import tlSelect from '../../components/input/tl-select.vue';
import tlButton from '../../components/button/tl-button.vue';
import tlIconButton from '../../components/button/tl-icon-button.vue';

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
    tlIconButton,
  },
  data() {
    return {
      steps: {
        current: 0,
        total: 3,
      },
      initialData: null,

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
          client_id: null,
          supplier_number: '',
          amount: '0',
          currency: 'EUR',
          invoice_date: new Date().toISOString().split('T')[0],
          due_date: new Date().toISOString().split('T')[0],
          bank_account_details: '',
          notes: '',
          tax: '0',
          discount: '0',
          shipping_fee: '0',
          items: [],
        },
        errors: {},
        loading: false,
      },
      datadb,
      newInvoiceId: null,
    };
  },
  computed: {
    clientOptions() {
      if (!this.datadb.clients.data) return [];
      return [
        { label: 'Crea nuovo cliente', value: 'new_client' },
        ...this.datadb.clients.data.map((client) => ({
          label: client.name,
          value: client.id,
        })),
      ];
    },
    isDirty() {
      // Se la fattura è stata salvata con successo, non mostriamo l'avviso
      if (this.steps.current === 4) return false;
      return JSON.stringify(this.dataInvoice.data) !== this.initialData;
    },
  },
  methods: {
    handleBeforeUnload(event) {
      if (this.isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    },
    addItem() {
      this.dataInvoice.data.items.push({
        description: '',
        quantity: 1,
        unit_cost: 1,
        amount: 1,
      });
      this.updateTotalAmount();
    },
    removeItem(index) {
      this.dataInvoice.data.items.splice(index, 1);
      this.updateTotalAmount();
    },
    calculateItemAmount(index) {
      const item = this.dataInvoice.data.items[index];
      item.amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_cost) || 0);
      this.updateTotalAmount();
    },
    updateTotalAmount() {
      const itemsTotal = this.dataInvoice.data.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      const taxPercent = parseFloat(this.dataInvoice.data.tax) || 0;
      const shipping = parseFloat(this.dataInvoice.data.shipping_fee) || 0;
      const discount = parseFloat(this.dataInvoice.data.discount) || 0;

      const taxAmount = (itemsTotal * taxPercent) / 100;

      this.dataInvoice.data.amount = (itemsTotal + taxAmount + shipping - discount).toFixed(2);
    },
    handleContinue(currentStep, analysisMode) {
      const stepSelectionMode = 0;
      const stepAnalysisiInvoice = 1;
      const stepSummary = 2;

      if (currentStep === stepSelectionMode) {
        this.steps.current++;
        this.dataInvoice.data.file.analysisType = analysisMode;
      } else if (currentStep === stepAnalysisiInvoice) {
        this.processInvoice();
      } else if (currentStep === stepSummary) {
        this.handleSave();
      }
    },
    goToInvoice() {
      if (this.newInvoiceId) {
        this.$router.push(`/invoice/${this.newInvoiceId}`);
      } else {
        this.$router.push('/');
      }
    },

    async processInvoice() {
      if (!this.dataInvoice.data.file.selectedFile) return;

      this.dataInvoice.data.file.invoiceAnalysis = null;
      this.dataInvoice.loading = true;
      this.dataInvoice.data.file.error = null;
      this.dataInvoice.data.file.progress = 0;

      // Carica i clienti se non presenti
      if (this.datadb.clients.data.length === 0) {
        await getClients();
      }

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
          this.dataInvoice.data.items = analysisResults.items || [];
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
          this.dataInvoice.data.items = analysisResults.items || [];
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
    async handleSave() {
      const profileId = auth.profile?.id;
      if (!profileId) {
        alert('Errore: Profilo non trovato. Per favore effettua il login.');
        return;
      }

      this.dataInvoice.loading = true;

      const invoiceData = {
        profile_id: profileId,
        client_id: this.dataInvoice.data.client_id,
        supplier_name: this.dataInvoice.data.supplier_name,
        supplier_number: this.dataInvoice.data.supplier_number,
        amount: parseFloat(this.dataInvoice.data.amount),
        currency: this.dataInvoice.data.currency,
        invoice_date: this.dataInvoice.data.invoice_date,
        due_date: this.dataInvoice.data.due_date,
        bank_account_details: this.dataInvoice.data.bank_account_details,
        notes: this.dataInvoice.data.notes,
        tax: parseFloat(this.dataInvoice.data.tax),
        discount: parseFloat(this.dataInvoice.data.discount),
        shipping_fee: parseFloat(this.dataInvoice.data.shipping_fee),
        status: 'pending',
      };

      const items = this.dataInvoice.data.items.map((item) => ({
        description: item.description,
        quantity: parseFloat(item.quantity),
        unit_cost: parseFloat(item.unit_cost),
        amount: parseFloat(item.amount),
      }));

      try {
        const { data, error } = await createInvoice(invoiceData, items);

        if (error) {
          alert('Errore durante il salvataggio: ' + error);
        } else {
          this.newInvoiceId = data.id;
          this.steps.current = 4; // Mostra lo step di successo
        }

        toast.dark('Salvato con successo!', { showIcon: false, closable: false });
      } catch (err) {
        console.error(err);
        alert('Errore imprevisto durante il salvataggio.');
      } finally {
        this.dataInvoice.loading = false;
      }
    },
  },
  watch: {
    'dataInvoice.data.client_id'(newVal) {
      if (newVal === 'new_client') {
        this.$router.push('/new-client');
        this.$nextTick(() => {
          this.dataInvoice.data.client_id = null;
        });
      } else if (newVal) {
        const selectedClient = this.datadb.clients.data.find((c) => c.id === newVal);
        if (selectedClient) {
          this.dataInvoice.data.supplier_name = selectedClient.name;
        }
      }
    },
  },
  mounted() {
    this.initialData = JSON.stringify(this.dataInvoice.data);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.isDirty) {
      const answer = window.confirm('Hai delle modifiche non salvate. Sei sicuro di voler uscire?');
      if (answer) {
        next();
      } else {
        next(false);
      }
    } else {
      next();
    }
  },
};
</script>

<style scoped></style>
