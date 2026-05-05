<template>
  <sidebar />
  <mainView>
    <div class="w-full h-svh flex flex-col items-center justify-center text-center">
      <h2 class="text-xl font-semibold">Pagina non trovata</h2>
      <p class="text-gray-500 text-sm font-normal mt-1">Spiacenti, questa pagina non esiste.</p>
      <RouterLink to="/" class="mt-6">
        <tlButton size="small" variant="secondary" label="Indietro" />
      </RouterLink>
    </div>
  </mainView>
</template>

<script>
import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';
import tlButton from '../components/button/tl-button.vue';

export default {
  name: 'Not-found',
  components: {
    sidebar,
    mainView,
    tlButton,
  },
};
</script>

<style scoped></style>
