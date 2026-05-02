<template>
  <sidebar />
  <mainView>
    <div v-if="!invoice.loading && !invoice.error" class="w-full h-11 flex items-center">
      <RouterLink to="/">
        <tlIconButton size="extra-small" icon="ChevronLeft" class="mr-2" />
      </RouterLink>
      <h1 class="text-black text-2xl font-semibold max-one-line">{{ invoice.data?.supplier_name }}</h1>
      <div class="ml-auto flex gap-2 items-center">
        <tlButton
          v-if="invoice.data?.file_url"
          @click="previewIsVisible = !previewIsVisible"
          size="small"
          variant="tertiary"
          :leftIcon="previewIsVisible ? 'EyeClosed' : 'Eye'"
          :label="previewIsVisible ? 'Hide Preview' : 'Show Preview'"
        />
        <tlButton size="small" variant="tertiary" leftIcon="Pen" label="Modifica" />
      </div>
    </div>
    <div
      v-if="!invoice.loading && !invoice.error"
      class="w-full min-h-svh mt-8 grid gap-6"
      :class="{ 'lg:grid-cols-2': previewIsVisible && invoice.data?.file_url }"
    >
      <div class="w-full h-full p-2.5 rounded-[18px] border border-black/5 bg-[#F5F5F5]"></div>
      <div v-if="previewIsVisible && invoice.data?.file_url" class="w-full h-full p-2.5 rounded-[18px] border border-black/5 bg-[#F5F5F5]">
        <iframe :src="invoice.data?.file_url" frameborder="0" class="w-full h-full"></iframe>
      </div>
    </div>
    <div v-else-if="invoice.loading && !invoice.error" class="w-full py-8 flex items-center justify-center">
      <loader />
    </div>
    <div v-else-if="invoice.error" class="w-full h-svh flex flex-col items-center justify-center text-center">
      <h2 class="text-xl font-semibold">Fattura non trovata</h2>
      <p class="text-gray-500 text-sm font-normal mt-1">Spiacenti, questa fattura non esiste.</p>
      <RouterLink to="/" class="mt-6">
        <tlButton size="small" variant="secondary" label="Indietro" />
      </RouterLink>
    </div>
  </mainView>
</template>

<script>
import { datadb } from '../../data/datadb';
import { getInvoiceById } from '../../api/invoices';

import sidebar from '../../components/navigation/sidebar.vue';
import mainView from '../../components/global/main-view.vue';
import loader from '../../components/global/loader.vue';
import tlButton from '../../components/button/tl-button.vue';
import tlIconButton from '../../components/button/tl-icon-button.vue';

export default {
  name: 'Invoice',
  components: {
    sidebar,
    mainView,
    loader,
    tlButton,
    tlIconButton,
  },
  data() {
    return {
      invoice: datadb.invoice,

      invoiceId: this.$route.params.id,
      previewIsVisible: true,
    };
  },
  methods: {
    async getInvoice() {
      if (!this.invoiceId) return;

      try {
        await getInvoiceById(this.invoiceId);
        this.invoice = datadb.invoice;
      } catch (error) {
        console.error(error);
      }
    },
  },
  watch: {
    '$route.params.id': {
      handler(value) {
        if (value) {
          this.getInvoice();
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped></style>
