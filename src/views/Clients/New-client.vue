<template>
  <sidebar />
  <mainView>
    <div class="w-full h-11 flex items-center">
      <RouterLink :to="isEdit ? `/client/${data.form.id}` : '/clients'">
        <tlIconButton size="extra-small" icon="ChevronLeft" class="mr-2" />
      </RouterLink>
      <h1 class="text-black text-2xl font-semibold max-one-line">
        {{ isEdit ? 'Modifica Cliente' : 'Nuovo Cliente' }}
      </h1>
    </div>

    <div class="w-full mt-8">
      <div class="w-full max-w-[600px] mx-auto flex flex-col gap-8 pb-20">
        <!-- Informazioni Generali -->
        <div class="flex flex-col gap-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Informazioni Generali</h3>
          <div class="flex flex-col gap-4">
            <tlInput v-model="data.form.name" label="Nome Cliente / Ragione Sociale" placeholder="Es: Mario Rossi o Rossi S.r.l." />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <tlInput v-model="data.form.email" label="Email" placeholder="email@esempio.com" />
              <tlInput v-model="data.form.phone" label="Telefono" placeholder="+39 012 3456789" />
            </div>
            <tlInput v-model="data.form.website" label="Sito Web" placeholder="https://www.esempio.com" />
          </div>
        </div>

        <!-- Dati Fiscali -->
        <div class="flex flex-col gap-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Dati Fiscali</h3>
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <tlInput v-model="data.form.vat_number" label="Partita IVA" placeholder="IT01234567890" />
              <tlInput v-model="data.form.tax_code" label="Codice Fiscale" placeholder="RSSMRA80A01H501U" />
            </div>
            <tlInput v-model="data.form.company_name" label="Nome Azienda (se differente)" />
          </div>
        </div>

        <!-- Indirizzo -->
        <div class="flex flex-col gap-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Indirizzo</h3>
          <div class="flex flex-col gap-4">
            <tlInput v-model="data.form.address" label="Indirizzo" placeholder="Via Roma, 1" />
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <tlInput v-model="data.form.city" label="Città" placeholder="Milano" />
              <tlInput v-model="data.form.postal_code" label="CAP" placeholder="20121" />
              <tlInput v-model="data.form.country" label="Paese" placeholder="Italia" />
            </div>
          </div>
        </div>

        <!-- Altro -->
        <div class="flex flex-col gap-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Altro</h3>
          <div class="flex flex-col gap-4">
            <tlInput v-model="data.form.notes" label="Note" placeholder="Aggiungi eventuali note..." />
            <tlSelect
              v-model="data.form.status"
              label="Stato"
              :options="[
                { label: 'Attivo', value: 'active' },
                { label: 'Inattivo', value: 'inactive' },
              ]"
            />
          </div>
        </div>

        <!-- Azioni -->
        <div class="w-full pt-6 flex flex-col gap-2">
          <tlButton @click="handleSave" :loading="loading" variant="primary" :label="isEdit ? 'Aggiorna Cliente' : 'Salva Cliente'" class="w-full" />
          <tlButton v-if="isEdit" @click="handleDelete" variant="tertiary" label="Elimina Cliente" class="w-full text-red-500!" />
        </div>
      </div>
    </div>
  </mainView>
</template>

<script>
import { auth } from '../../data/auth';
import { datadb } from '../../data/datadb';
import { getClients, createClient, updateClient, deleteClientById, getClientById } from '../../api/clients';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import tlInput from '../../components/input/tl-input.vue';
import tlSelect from '../../components/input/tl-select.vue';
import tlButton from '../../components/button/tl-button.vue';
import tlIconButton from '../../components/button/tl-icon-button.vue';

export default {
  name: 'New-client',
  components: {
    sidebar,
    mainView,
    tlInput,
    tlSelect,
    tlButton,
    tlIconButton,
  },
  data() {
    return {
      data: {
        form: {
          id: null,
          name: '',
          email: '',
          phone: '',
          website: '',
          company_name: '',
          vat_number: '',
          tax_code: '',
          address: '',
          city: '',
          postal_code: '',
          country: 'Italia',
          notes: '',
          status: 'active',
        },
        error: {
          name: null,
          email: null,
          phone: null,
          website: null,
          company_name: null,
          vat_number: null,
          tax_code: null,
          address: null,
          city: null,
          postal_code: null,
          country: null,
          notes: null,
          status: null,
        },
        loading: false,
      },
    };
  },
  computed: {
    isEdit() {
      return this.$route.name === 'edit-client';
    },
  },
  methods: {
    async loadClient(id) {
      this.data.loading = true;
      try {
        const { data } = await getClientById(id);
        if (data) {
          this.data.form = { ...data };
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.data.loading = false;
      }
    },
    async handleSave() {
      if (!this.data.form.name) {
        alert('Il nome del cliente è obbligatorio');
        return;
      }

      this.data.loading = true;
      try {
        const clientData = { ...this.data.form };
        if (!this.isEdit) {
          delete clientData.id;
          clientData.profile_id = auth.user.id;
          await createClient(clientData);
        } else {
          const clientId = clientData.id;
          delete clientData.id;
          delete clientData.created_at;
          delete clientData.updated_at;
          await updateClient(clientId, clientData);
        }

        await getClients();
        if (this.isEdit) {
          this.$router.push(`/client/${this.data.form.id}`);
        } else {
          this.$router.push('/clients');
        }
      } catch (e) {
        console.error(e);
        alert('Errore durante il salvataggio del cliente');
      } finally {
        this.data.loading = false;
      }
    },
    async handleDelete() {
      if (!confirm('Sei sicuro di voler eliminare questo cliente?')) return;

      this.data.loading = true;
      try {
        await deleteClientById(this.data.form.id);
        await getClients();
        this.$router.push('/clients');
      } catch (e) {
        console.error(e);
        alert('Errore durante eliminazione del cliente');
      } finally {
        this.data.loading = false;
      }
    },
  },
  async mounted() {
    if (this.isEdit) {
      const clientId = this.$route.params.id;
      // Cerchiamo prima nello store locale
      const existingClient = datadb.clients.data.find((c) => c.id === clientId);
      if (existingClient) {
        this.data.form = { ...existingClient };
      } else {
        await this.loadClient(clientId);
      }
    }
  },
};
</script>

<style scoped></style>
