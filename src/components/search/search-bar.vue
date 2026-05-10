<template>
  <Transition name="slide-fade">
    <div v-if="store.searchBar.isOpen" class="fixed z-99999 top-8 left-8 w-full pointer-events-none">
      <div class="max-w-[500px] mx-auto flex flex-col gap-1 pointer-events-auto">
        <div class="relative w-full px-4 py-2.5 h-[50px] rounded-[18px] flex items-center border border-black/5 bg-white shadow-2xl shadow-black/15">
          <div class="h-full aspect-square flex items-center justify-center pointer-events-none">
            <SearchIcon size="16" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Inizia a cercare..."
            class="w-full outline-0"
            @keydown.down.prevent="moveSelection(1)"
            @keydown.up.prevent="moveSelection(-1)"
            @keydown.enter="selectCurrentItem"
            @keydown.esc="clearSearch"
          />
          <tlIconButton @click="clearSearch" size="small" variant="" icon="X" />
          <tlIconButton v-if="false" size="small" variant="" icon="ListFilter" />
        </div>

        <div
          v-if="searchQuery && (results.invoices.length > 0 || results.clients.length > 0)"
          class="relative w-full p-2.5 rounded-[18px] flex flex-col gap-2.5 border border-black/5 bg-white shadow-2xl shadow-black/15 overflow-hidden max-h-[70vh] overflow-y-auto"
        >
          <!-- LOADING STATE -->
          <div v-if="loading" class="w-full py-8 flex items-center justify-center">
            <div class="w-6 h-6 border-2 border-black/10 border-t-black rounded-full animate-spin"></div>
          </div>

          <template v-else>
            <!-- FATTURE -->
            <div v-if="results.invoices.length > 0" class="w-full flex flex-col gap-1">
              <div class="w-full flex items-center justify-between px-1">
                <h2 class="text-gray-500 text-xs font-medium">Fatture</h2>
                <RouterLink to="/invoices" class="flex items-center cursor-pointer hover:opacity-70 transition-opacity">
                  <span class="text-black text-xs font-medium">Vai a tutte le fatture</span>
                  <ChevronRight size="18" />
                </RouterLink>
              </div>
              <div class="w-full flex flex-col gap-0.5">
                <div
                  v-for="(invoice, index) in results.invoices"
                  :key="invoice.id"
                  class="result-item w-full p-1.5 rounded-2xl flex items-center cursor-pointer transition-colors"
                  :class="{ 'bg-gray-100': selectionType === 'invoice' && selectedIndex === index }"
                  @click="goToInvoice(invoice.id)"
                  @mouseenter="setSelection('invoice', index)"
                >
                  <div class="flex gap-3 items-center w-full">
                    <tlAvatar size="small" :fallback="invoice.supplier_name?.charAt(0) || 'F'" />
                    <div class="flex flex-col min-w-0 flex-1">
                      <h2 class="text-black text-sm font-medium truncate">{{ invoice.supplier_name }}</h2>
                      <p class="text-gray-500 text-xs font-normal truncate">#{{ invoice.supplier_number }} • {{ formatCurrency(invoice.amount) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- CLIENTI -->
            <div v-if="results.clients.length > 0" class="w-full flex flex-col gap-1">
              <div class="w-full flex items-center justify-between px-1">
                <h2 class="text-gray-500 text-xs font-medium">Clienti</h2>
                <RouterLink to="/clients" class="flex items-center cursor-pointer hover:opacity-70 transition-opacity">
                  <span class="text-black text-xs font-medium">Vai a tutti i clienti</span>
                  <ChevronRight size="18" />
                </RouterLink>
              </div>
              <div class="w-full flex flex-col gap-0.5">
                <div
                  v-for="(client, index) in results.clients"
                  :key="client.id"
                  class="result-item w-full p-1.5 rounded-2xl flex items-center cursor-pointer transition-colors"
                  :class="{ 'bg-gray-100': selectionType === 'client' && selectedIndex === index }"
                  @click="goToClient(client.id)"
                  @mouseenter="setSelection('client', index)"
                >
                  <div class="flex gap-3 items-center w-full">
                    <tlAvatar size="small" :image="client?.logo_url" :fallback="client.name?.charAt(0) || 'C'" />
                    <div class="flex flex-col min-w-0 flex-1">
                      <h2 class="text-black text-sm font-medium truncate">{{ client.name }}</h2>
                      <p class="text-gray-500 text-xs font-normal truncate">{{ client.email || 'Nessuna email' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div
          v-else-if="searchQuery && !loading"
          class="relative w-full p-6 rounded-[18px] flex flex-col items-center justify-center gap-2 border border-black/5 bg-white shadow-2xl shadow-black/15"
        >
          <p class="text-gray-500 text-sm">Nessun risultato trovato per "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div
      v-if="store.searchBar.isOpen"
      @click="store.searchBar.isOpen = false"
      class="fixed z-9999 top-0 left-0 w-full h-svh bg-black opacity-30"
    ></div>
  </Transition>
</template>

<script>
import { searchGlobal } from '../../api/search';
import { debounce } from '../../utils/search';
import { formatCurrency } from '../../utils/format';
import { store } from '../../data/store';

import tlIconButton from '../button/tl-icon-button.vue';
import tlAvatar from '../avatar/tl-avatar.vue';

// ICONS
import { Search as SearchIcon, ChevronRight } from '@lucide/vue';

export default {
  name: 'search-bar',
  components: {
    tlIconButton,
    tlAvatar,
    // ICONS
    SearchIcon,
    ChevronRight,
  },
  data() {
    return {
      store,

      searchQuery: '',
      results: {
        invoices: [],
        clients: [],
      },
      loading: false,
      selectedIndex: -1,
      selectionType: 'invoice', // 'invoice' o 'client'
    };
  },
  computed: {
    totalResults() {
      return this.results.invoices.length + this.results.clients.length;
    },
  },
  methods: {
    formatCurrency,

    clearSearch() {
      if (this.searchQuery) {
        this.searchQuery = '';
        this.results = { invoices: [], clients: [] };
        this.selectedIndex = -1;
        this.loading = false;
      } else {
        this.closeSearch();
      }
    },
    closeSearch() {
      this.store.searchBar.isOpen = false;
      this.searchQuery = '';
      this.results = { invoices: [], clients: [] };
      this.loading = false;
    },
    goToInvoice(id) {
      this.$router.push({ name: 'invoice', params: { id } });
      this.closeSearch();
      this.clearSearch();
    },
    goToClient(id) {
      this.$router.push({ name: 'client', params: { id } });
      this.closeSearch();
      this.clearSearch();
    },
    setSelection(type, index) {
      this.selectionType = type;
      this.selectedIndex = index;
    },
    moveSelection(direction) {
      const invCount = this.results.invoices.length;
      const cliCount = this.results.clients.length;
      const total = invCount + cliCount;

      if (total === 0) return;

      let currentAbsoluteIndex = -1;
      if (this.selectedIndex !== -1) {
        currentAbsoluteIndex = this.selectionType === 'invoice' ? this.selectedIndex : invCount + this.selectedIndex;
      }

      const newAbsoluteIndex = (currentAbsoluteIndex + direction + total) % total;

      if (newAbsoluteIndex < invCount) {
        this.selectionType = 'invoice';
        this.selectedIndex = newAbsoluteIndex;
      } else {
        this.selectionType = 'client';
        this.selectedIndex = newAbsoluteIndex - invCount;
      }
    },
    selectCurrentItem() {
      if (this.selectedIndex === -1) return;

      if (this.selectionType === 'invoice') {
        const invoice = this.results.invoices[this.selectedIndex];
        if (invoice) this.goToInvoice(invoice.id);
      } else {
        const client = this.results.clients[this.selectedIndex];
        if (client) this.goToClient(client.id);
      }
    },
  },
  watch: {
    searchQuery(newQuery) {
      if (!newQuery || newQuery.length < 2) {
        this.results = { invoices: [], clients: [] };
        this.loading = false;
        return;
      }
      this.loading = true;
      this.debouncedSearch();
    },
  },
  created() {
    this.debouncedSearch = debounce(async () => {
      if (this.searchQuery.length < 2) return;

      const searchResults = await searchGlobal(this.searchQuery);
      this.results = searchResults;
      this.loading = false;
      this.selectedIndex = -1;
    }, 300);
  },
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 300ms ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.result-item:hover {
  background-color: #f9f9f9;
}
</style>
