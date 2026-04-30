<template>
  <div class="card-row relative h-16 p-2.5 rounded-[18px] flex items-center border border-black/5 bg-white overflow-y-hidden overflow-x-auto">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'card-row',
};
</script>

<style scoped></style>
