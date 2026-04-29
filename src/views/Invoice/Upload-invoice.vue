<template>
  <sidebar />
  <mainView>
    <div class="max-w-2xl mx-auto py-8">
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Carica Fattura</h1>
        <p class="text-gray-500">Carica un file PDF della tua fattura. L'IA estrarrà automaticamente i dati per te.</p>
      </div>

      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
          @click="$refs.fileInput.click()"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input type="file" ref="fileInput" class="hidden" accept=".pdf" @change="handleFileSelect" />

          <div v-if="!selectedFile" class="space-y-2">
            <div class="flex justify-center">
              <span class="p-3 bg-blue-50 rounded-full text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </span>
            </div>
            <div class="text-sm text-gray-600"><span class="font-semibold text-blue-600">Clicca per caricare</span> o trascina un file</div>
            <p class="text-xs text-gray-400">Solo PDF (max. 10MB)</p>
          </div>

          <div v-else class="space-y-2">
            <div class="flex justify-center">
              <span class="p-3 bg-green-50 rounded-full text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14.5 2 14.5 7.5 20 7.5" />
                </svg>
              </span>
            </div>
            <div class="text-sm font-medium text-gray-900">{{ selectedFile.name }}</div>
            <div class="text-xs text-gray-500">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</div>
            <button @click.stop="selectedFile = null" class="text-xs text-red-600 hover:underline">Rimuovi file</button>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-4">
          <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
            {{ error }}
          </div>

          <div v-if="loading" class="space-y-2">
            <div class="flex justify-between text-xs font-medium text-gray-500">
              <span>{{ loadingStatus }}</span>
              <span>{{ progress }}%</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-1.5">
              <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
            </div>
          </div>

          <tlButton
            @click="processInvoice"
            :disabled="!selectedFile || loading"
            class="w-full justify-center"
            :loading="loading"
            label="Analizza e Salva Fattura"
          />
        </div>
      </div>
    </div>
  </mainView>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../lib/supabase';
import { auth } from '../../data/auth';
import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import tlButton from '../../components/button/tl-button.vue';

export default {
  name: 'Upload-invoice',
  components: {
    sidebar,
    mainView,
    tlButton,
  },
  setup() {
    const router = useRouter();
    const selectedFile = ref(null);
    const loading = ref(false);
    const loadingStatus = ref('');
    const progress = ref(0);
    const error = ref(null);

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
        error.value = null;
      } else {
        error.value = 'Per favore seleziona un file PDF valido.';
      }
    };

    const handleDrop = (event) => {
      const file = event.dataTransfer.files[0];
      if (file && file.type === 'application/pdf') {
        selectedFile.value = file;
        error.value = null;
      } else {
        error.value = 'Per favore trascina un file PDF valido.';
      }
    };

    // --- LOGIC FUNCTIONS ---

    const uploadToStorage = async (file) => {
      loadingStatus.value = 'Caricamento file su Supabase...';
      progress.value = 20;

      const fileExt = file.name.split('.').pop();
      const fileName = `${auth.user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('invoices').upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('invoices').getPublicUrl(filePath);

      return publicUrl;
    };

    const extractTextFromPDF = async (file) => {
      loadingStatus.value = 'Estrazione testo dal PDF...';
      progress.value = 40;

      // In un MVP reale useremmo una libreria come pdfjs-dist.
      // Qui simuliamo l'estrazione per brevità come richiesto.
      // Un'alternativa sarebbe inviare il file direttamente a un'API che supporta PDF.
      return `Contenuto simulato della fattura ${file.name}. Importo: 1250.00 EUR. Fornitore: ACME Corp. Data: 2024-04-20.`;
    };

    const callOpenAI = async (text) => {
      loadingStatus.value = 'Analisi con IA in corso...';
      progress.value = 70;

      const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

      if (!OPENAI_API_KEY) {
        console.warn('VITE_OPENAI_API_KEY non trovata. Uso dati placeholder.');
        return {
          supplier_name: 'Fornitore Esempio',
          invoice_number: 'INV-' + Math.floor(Math.random() * 10000),
          amount: 125.5,
          currency: 'EUR',
          invoice_date: new Date().toISOString().split('T')[0],
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        };
      }

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content:
                  'Sei un assistente esperto in contabilità. Estrai i dati dalla fattura fornita e restituisci SOLO un JSON con questi campi: supplier_name, invoice_number, amount, currency, invoice_date, due_date.',
              },
              {
                role: 'user',
                content: text,
              },
            ],
            response_format: { type: 'json_object' },
          }),
        });

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);
      } catch (e) {
        console.error('Errore OpenAI:', e);
        throw new Error('Impossibile analizzare la fattura con IA.');
      }
    };

    const saveToDatabase = async (invoiceData, fileUrl) => {
      loadingStatus.value = 'Salvataggio nel database...';
      progress.value = 90;

      const { error: dbError } = await supabase.from('invoices').insert({
        profile_id: auth.user.id,
        supplier_name: invoiceData.supplier_name,
        supplier_number: invoiceData.invoice_number, // Mappato su supplier_number nel DB
        amount: invoiceData.amount,
        currency: invoiceData.currency || 'EUR',
        invoice_date: invoiceData.invoice_date,
        due_date: invoiceData.due_date,
        status: 'pending',
        file_url: fileUrl,
      });

      if (dbError) throw dbError;
    };

    const processInvoice = async () => {
      if (!selectedFile.value) return;

      loading.value = true;
      error.value = null;
      progress.value = 0;

      try {
        // 1. Upload to Storage
        const fileUrl = await uploadToStorage(selectedFile.value);

        // 2. Extract Text
        const text = await extractTextFromPDF(selectedFile.value);

        // 3. AI Extraction
        const extractedData = await callOpenAI(text);

        // 4. Save to DB
        await saveToDatabase(extractedData, fileUrl);

        progress.value = 100;
        loadingStatus.value = 'Completato!';

        // Redirect to Home after success
        setTimeout(() => {
          router.push({ name: 'home' });
        }, 1500);
      } catch (e) {
        console.error('Process error:', e);
        error.value = e.message || 'Si è verificato un errore durante il processo.';
        loading.value = false;
      }
    };

    return {
      selectedFile,
      loading,
      loadingStatus,
      progress,
      error,
      auth,
      handleFileSelect,
      handleDrop,
      processInvoice,
    };
  },
};
</script>

<style scoped></style>
