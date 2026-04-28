<template>
  <div>
    <RouterView />
  </div>
</template>

<script>
import { auth } from './data/auth';
import { getAuthUser } from './lib/auth';

export default {
  name: 'App',
  data() {
    return {
      auth,
    };
  },
  async mounted() {
    await getAuthUser();
  },
};
</script>

<style></style>
