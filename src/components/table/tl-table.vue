<template>
  <div class="tl-table-wrapper w-full border border-gray-100 overflow-x-auto">
    <table class="w-full border-collapse text-left">
      <slot />
    </table>
  </div>
</template>

<script>
export default {
  name: 'tl-table',
};
</script>

<style scoped></style>
