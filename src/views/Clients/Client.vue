<template>
  <sidebar />
  <mainView>
    <div v-if="!datadb.client.loading && !datadb.client.error" class="w-full h-11 flex items-center">
      <RouterLink to="/clients">
        <tlIconButton size="extra-small" icon="ChevronLeft" class="mr-2" />
      </RouterLink>
      <h1 class="text-black text-2xl font-semibold max-one-line">{{ datadb.client.data?.name }}</h1>
      <div v-if="!store.windowOptions.isMobile" class="ml-auto flex gap-2 items-center">
        <RouterLink :to="`/client/edit/${datadb.client.data?.id}`">
          <tlButton size="small" variant="tertiary" leftIcon="Pen" label="Modifica Cliente" />
        </RouterLink>
        <tlButton @click="handleDelete" size="small" variant="destructive" leftIcon="Trash2" label="Elimina Cliente" />
      </div>
      <div v-else-if="store.windowOptions.isMobile" class="ml-auto">
        <dropdown>
          <template #trigger>
            <tlIconButton size="small" icon="EllipsisVertical" />
          </template>
          <template #options>
            <RouterLink :to="`/client/edit/${datadb.client.data?.id}`">
              <dropdownItem icon="Pen" label="Modifica Cliente" />
            </RouterLink>
            <dropdownItem @click="handleDelete" icon="Trash2" label="Elimina Cliente" />
          </template>
        </dropdown>
      </div>
    </div>

    <div v-if="!datadb.client.loading && !datadb.client.error" class="w-full mt-8 grid lg:grid-cols-[1fr_350px] gap-6 pb-12">
      <div class="flex flex-col gap-6">
        <!-- Info Card -->
        <div class="p-6 rounded-[24px] border border-black/5 bg-white flex flex-col gap-6">
          <div class="flex items-center gap-4">
            <tlAvatar :fallback="datadb.client.data?.name?.charAt(0)" />
            <div class="flex flex-col">
              <h2 class="text-xl font-bold text-black">{{ datadb.client.data?.name }}</h2>
              <p class="text-gray-500 text-sm font-normal">{{ datadb.client.data?.company_name || 'Libero professionista' }}</p>
            </div>
            <div class="ml-auto">
              <badge :variant="getClientStatusVariant(datadb.client.data?.status)" :label="getClientStatusLabel(datadb.client.data?.status)" />
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6 pt-6 border-t border-black/5">
            <div class="flex flex-col gap-1">
              <span class="text-[#212121]/50 text-xs font-semibold uppercase tracking-wider">Contatti</span>
              <div class="flex flex-col gap-2 mt-2">
                <div v-if="datadb.client.data?.email" class="flex items-center gap-2 text-sm text-black">
                  <Mail size="16" class="text-gray-400" />
                  <a href="mailto:{{ datadb.client.data?.email }}">{{ datadb.client.data?.email }}</a>
                </div>
                <div v-if="datadb.client.data?.phone" class="flex items-center gap-2 text-sm text-black">
                  <Phone size="16" class="text-gray-400" />
                  <a href="tel:{{ datadb.client.data?.phone }}">{{ datadb.client.data?.phone }}</a>
                </div>
                <div v-if="datadb.client.data?.website" class="flex items-center gap-2 text-sm text-black">
                  <Globe size="16" class="text-gray-400" />
                  <a href="https://{{ datadb.client.data?.website }}">{{ datadb.client.data?.website }}</a>
                </div>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-[#212121]/50 text-xs font-semibold uppercase tracking-wider">Dati Fiscali</span>
              <div class="flex flex-col gap-2 mt-2">
                <div
                  @click="actionCopy(datadb.client.data?.vat_number)"
                  v-if="datadb.client.data?.vat_number"
                  class="flex items-center gap-2 text-sm text-black"
                >
                  <span class="font-bold text-[10px] text-gray-400 border border-gray-400 rounded px-1">IVA</span>
                  {{ datadb.client.data?.vat_number }}
                </div>
                <div
                  @click="actionCopy(datadb.client.data?.tax_code)"
                  v-if="datadb.client.data?.tax_code"
                  class="flex items-center gap-2 text-sm text-black"
                >
                  <span class="font-bold text-[10px] text-gray-400 border border-gray-400 rounded px-1">CF</span>
                  {{ datadb.client.data?.tax_code }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1 pt-6 border-t border-black/5">
            <span class="text-[#212121]/50 text-xs font-semibold uppercase tracking-wider">Indirizzo</span>
            <div class="flex items-start gap-2 mt-2 text-sm text-black">
              <MapPin size="16" class="text-gray-400 mt-0.5" />
              <div class="flex flex-col">
                <span>{{ datadb.client.data?.address }}</span>
                <span>{{ datadb.client.data?.postal_code }} {{ datadb.client.data?.city }} ({{ datadb.client.data?.country }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Invoices List -->
        <shelf>
          <div class="w-full flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <div class="flex gap-2 items-center">
                <Files size="20" />
                <span class="text-black text-base font-medium">Fatture Associate</span>
                <span v-if="datadb.client.data?.invoices" class="text-[#656565] text-xs font-medium">({{ datadb.client.data.invoices.length }})</span>
              </div>
            </div>

            <div
              v-if="datadb.client.data?.invoices?.length === 0"
              class="w-full py-10 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 rounded-2xl"
            >
              <p class="text-gray-400 text-sm">Nessuna fattura associata a questo cliente.</p>
            </div>
            <div v-else class="w-full flex flex-col gap-1">
              <cardRow @click="$router.push(`/invoice/${invoice.id}`)" v-for="invoice in datadb.client.data?.invoices" :key="invoice.id">
                <div class="w-full lg:max-w-[200px] flex gap-2 items-center">
                  <chip :label="invoice.supplier_number" />
                </div>
                <div class="w-full ml-4 grid grid-cols-[1fr_120px_120px] items-center gap-4">
                  <div class="flex gap-2 justify-center">
                    <chip icon="Calendar" :label="formatDate(invoice.invoice_date)" />
                  </div>
                  <div class="flex justify-end">
                    <chip :label="formatCurrency(invoice.amount)" />
                  </div>
                  <div class="flex justify-end">
                    <badge :variant="getInvoiceStatusVariant(invoice.status)" :label="getInvoiceStatusLabel(invoice.status)" />
                  </div>
                </div>
              </cardRow>
            </div>
          </div>
        </shelf>
      </div>

      <!-- Stats Sidebar -->
      <div class="flex flex-col gap-6">
        <div class="p-6 rounded-[24px] border border-black/5 bg-white flex flex-col gap-6">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Statistiche Cliente</h3>

          <div class="flex flex-col gap-4">
            <div class="flex flex-col">
              <span class="text-[#212121]/50 text-xs font-normal">Totale Fatturato</span>
              <span class="text-2xl font-bold text-black">{{ formatCurrency(datadb.client.data?.total_invoiced) }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[#212121]/50 text-xs font-normal">Numero Fatture</span>
              <span class="text-2xl font-bold text-black">{{ datadb.client.data?.invoices_count }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[#212121]/50 text-xs font-normal">Ultima Fattura</span>
              <span class="text-sm font-medium text-black">{{
                datadb.client.data?.last_invoice_at ? formatDate(datadb.client.data.last_invoice_at) : 'Mai'
              }}</span>
            </div>
          </div>
        </div>

        <div v-if="datadb.client.data?.notes" class="p-6 rounded-[24px] border border-black/5 bg-white flex flex-col gap-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">Note</h3>
          <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ datadb.client.data.notes }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="datadb.client.loading" class="w-full h-64 flex items-center justify-center">
      <loader />
    </div>
  </mainView>
</template>

<script>
import { datadb } from '../../data/datadb';
import { store } from '../../data/store';
import { getClientById, deleteClientById } from '../../api/clients';
import {
  formatCurrency,
  formatDate,
  getInvoiceStatusVariant,
  getInvoiceStatusLabel,
  getClientStatusVariant,
  getClientStatusLabel,
} from '../../utils/format';
import { toast } from '../../utils/toast';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import loader from '../../components/global/loader.vue';
import dropdown from '../../components/dropdown/dropdown.vue';
import dropdownItem from '../../components/dropdown/dropdown-item.vue';
import tlButton from '../../components/button/tl-button.vue';
import tlIconButton from '../../components/button/tl-icon-button.vue';
import tlAvatar from '../../components/avatar/tl-avatar.vue';
import badge from '../../components/badge/badge.vue';
import shelf from '../../components/shelf/shelf.vue';
import cardRow from '../../components/card/card-row.vue';
import chip from '../../components/chip/chip.vue';

// ICONS
import { Mail, Phone, Globe, MapPin, Files } from '@lucide/vue';

export default {
  name: 'ClientDetail',
  components: {
    sidebar,
    mainView,
    loader,
    dropdown,
    dropdownItem,
    tlButton,
    tlIconButton,
    tlAvatar,
    badge,
    shelf,
    cardRow,
    chip,

    // ICONS
    Mail,
    Phone,
    Globe,
    MapPin,
    Files,
  },
  data() {
    return {
      datadb,
      store,

      clientId: this.$route.params.id,
    };
  },
  methods: {
    formatCurrency,
    formatDate,
    getInvoiceStatusVariant,
    getInvoiceStatusLabel,
    getClientStatusVariant,
    getClientStatusLabel,

    actionCopy(data) {
      if (!data) return;

      navigator.clipboard.writeText(data);
      toast.dark('Copiato!', { showIcon: false, closable: false });
    },

    async getClient() {
      if (!this.clientId) return;

      try {
        await getClientById(this.clientId);
      } catch (error) {
        console.error(error);
      }
    },
    async handleDelete() {
      if (!confirm('Sei sicuro di voler eliminare questo cliente?')) return;

      try {
        await deleteClientById(this.clientId);
        await this.getClient();
        this.$router.push('/clients');
      } catch (e) {
        console.error(e);
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler(value) {
        if (value) {
          this.getClient();
        }
      },
      immediate: true,
    },
  },
};
</script>
