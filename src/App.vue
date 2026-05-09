<template>
  <div>
    <RouterView />
    <tlToastContainer />
  </div>
</template>

<script>
import { auth } from './data/auth';
import { getAuthUser } from './lib/auth';
import { store } from './data/store';

import tlToastContainer from './components/toast/tl-toast-container.vue';

export default {
  name: 'App',
  components: {
    tlToastContainer,
  },
  data() {
    return {
      auth,
      store,
    };
  },
  methods: {
    handleResize() {
      if (window.innerWidth <= 768) {
        this.store.windowOptions.screenSize = 'mobile';
        this.store.windowOptions.isMobile = true;

        this.store.sidebarOptions.isCollapsed = true;
      } else {
        this.store.windowOptions.screenSize = 'desktop';
        this.store.windowOptions.isMobile = false;
      }
    },
  },
  async mounted() {
    window.addEventListener('resize', this.handleResize);

    this.handleResize();

    await getAuthUser();
  },
  beforeMounted() {
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style></style>
