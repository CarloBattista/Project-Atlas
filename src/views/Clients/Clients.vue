<template>
  <sidebar />
  <mainView>
    <div class="w-full h-11 flex items-center">
      <h1 class="text-black text-2xl font-semibold">Clienti</h1>
      <div class="ml-auto flex gap-2 items-center">
        <RouterLink to="/new-client">
          <tlButton size="small" variant="tertiary" leftIcon="Plus" label="Nuovo cliente" />
        </RouterLink>
      </div>
    </div>

    <div class="w-full mt-8 flex flex-col gap-6">
      <shelf>
        <div class="w-full h-full flex flex-col gap-2.5">
          <div class="w-full flex gap-2 items-center">
            <UsersRound size="20" />
            <span class="text-black text-base font-medium">I tuoi clienti</span>
            <span v-if="datadb.clients.data" class="text-[#656565] text-xs font-medium">({{ datadb.clients.data.length }})</span>
          </div>

          <div
            v-if="!datadb.clients.loading && datadb.clients.data.length === 0"
            class="w-full my-14 flex flex-col items-center justify-center text-center"
          >
            <h2 class="text-xl font-semibold">Al momento non ci sono clienti</h2>
            <p class="text-gray-500 text-sm font-normal mt-1">Aggiungi il tuo primo cliente per iniziare a fatturare.</p>
          </div>

          <div v-else-if="!datadb.clients.loading && datadb.clients.data.length >= 1" class="w-full flex flex-col gap-1">
            <cardRow @click="editClient(client.id)" v-for="(client, index) in datadb.clients.data" :key="index">
              <div class="w-full lg:max-w-[300px] max-w-fit flex gap-2 items-center">
                <tlAvatar size="small" :fallback="client.name.charAt(0)" />
                <div class="h-full lg:flex hidden flex-col">
                  <h2 class="text-black text-sm font-medium max-one-line">{{ client.name }}</h2>
                  <p v-if="client.email" class="text-gray-500 text-xs font-normal max-one-line">{{ client.email }}</p>
                </div>
              </div>
              <div class="w-full ml-4 grid lg:grid-cols-[1fr_120px_120px_120px] grid-cols-[1fr_120px_120px] items-center gap-4">
                <div class="flex gap-2 items-center">
                  <chip v-if="client.company_name" :label="client.company_name" />
                  <chip v-if="client.vat_number" :label="'P.IVA: ' + client.vat_number" />
                </div>
                <div class="flex justify-end">
                  <chip icon="Files" :label="client.invoices_count + ' fatture'" />
                </div>
                <div class="flex justify-end">
                  <chip :label="formatCurrency(client.total_invoiced)" />
                </div>
                <div class="flex justify-end lg:flex hidden">
                  <badge :variant="client.status === 'active' ? 'success' : 'neutral'" :label="client.status" />
                </div>
              </div>
            </cardRow>
          </div>

          <div v-else-if="datadb.clients.loading" class="w-full my-14 flex items-center justify-center">
            <loader />
          </div>
        </div>
      </shelf>
    </div>
  </mainView>
</template>

<script>
import { auth } from '../../data/auth';
import { store } from '../../data/store';
import { datadb } from '../../data/datadb';
import { getClients } from '../../api/clients';
import { formatCurrency } from '../../utils/format';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import loader from '../../components/global/loader.vue';
import tlButton from '../../components/button/tl-button.vue';
import shelf from '../../components/shelf/shelf.vue';
import cardRow from '../../components/card/card-row.vue';
import tlAvatar from '../../components/avatar/tl-avatar.vue';
import chip from '../../components/chip/chip.vue';
import badge from '../../components/badge/badge.vue';

// ICONS
import { UsersRound } from '@lucide/vue';

export default {
  name: 'Clients',
  components: {
    sidebar,
    mainView,
    loader,
    tlButton,
    shelf,
    cardRow,
    tlAvatar,
    chip,
    badge,

    // ICONS
    UsersRound,
  },
  data() {
    return {
      auth,
      store,
      datadb,
    };
  },
  methods: {
    formatCurrency,
    editClient(clientId) {
      this.$router.push(`/client/${clientId}`);
    },
  },
  mounted() {
    getClients();
  },
};
</script>

<style scoped></style>
