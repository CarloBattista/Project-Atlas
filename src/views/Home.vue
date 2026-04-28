<template>
  <sidebar />
  <mainView>
    <div>Home</div>
  </mainView>
</template>

<script>
import sidebar from '../components/navigation/sidebar.vue';
import mainView from '../components/global/main-view.vue';

export default {
  name: 'Home',
  components: {
    sidebar,
    mainView,
  },
};
</script>

<style scoped></style>
