<template>
  <div
    class="card-row relative h-16 p-2.5 rounded-[18px] flex items-center border border-black/5 bg-[#F5F5F5] hover:bg-black/5 cursor-pointer overflow-y-hidden overflow-x-auto transition-colors duration-200"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'card-row',
};
</script>

<style scoped></style>
