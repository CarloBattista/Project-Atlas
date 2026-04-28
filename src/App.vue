<template>
  <div>
    <RouterView />
  </div>
</template>

<script>
import { getAuthUser } from './lib/auth';

export default {
  name: 'App',
  async mounted() {
    await getAuthUser();
  },
};
</script>

<style></style>
