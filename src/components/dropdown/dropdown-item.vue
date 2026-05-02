<template>
  <div
    class="dropdown-item relative h-9 px-3 rounded-[10px] flex gap-2 items-center bg-transparent hover:bg-white cursor-pointer transition-colors duration-200"
  >
    <div v-if="icon" class="h-full flex flex-none items-center justify-center">
      <component :is="icon" size="14" />
    </div>
    <span v-if="label" class="text-sm font-medium max-one-line">{{ label }}</span>
  </div>
</template>

<script>
// ICONS
import { EyeClosed, Eye, Pen, BanknoteArrowUp, BanknoteX } from '@lucide/vue';

export default {
  name: 'dropdown-item',
  components: {
    // ICONS
    EyeClosed,
    Eye,
    Pen,
    BanknoteArrowUp,
    BanknoteX,
  },
  props: {
    icon: String,
    label: String,
  },
};
</script>

<style scoped></style>
