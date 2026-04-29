<template>
  <sidebar />
  <mainView>
    <div class="w-full flex items-center">
      <h1 class="text-black text-2xl font-semibold">Welcome back, {{ auth.profile?.first_name }}!</h1>
      <div class="ml-auto flex gap-2 items-center">
        <tlButton size="small" variant="tertiary" leftIcon="Plus" label="New invoice" />
      </div>
    </div>
  </mainView>
</template>

<script>
import { auth } from '../data/auth';

import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';
import tlButton from '../components/button/tl-button.vue';

export default {
  name: 'Home',
  components: {
    sidebar,
    mainView,
    tlButton,
  },
  data() {
    return {
      auth,
    };
  },
};
</script>

<style scoped></style>
