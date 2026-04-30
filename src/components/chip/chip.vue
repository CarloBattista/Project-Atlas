<template>
  <div class="chip relative w-fit px-1.5 py-0.5 rounded-md flex gap-1 items-center justify-center bg-[#EDEDED] text-[#656565]">
    <component v-if="icon" :is="icon" size="12" stroke-width="2.5" />
    <span v-if="label" class="text-xs font-medium max-one-line">{{ label }}</span>
  </div>
</template>

<script>
// ICONS
import { FlagTriangleRight, Clock4, Euro } from '@lucide/vue';

export default {
  name: 'chip',
  components: {
    // ICONS
    FlagTriangleRight,
    Clock4,
    Euro,
  },
  props: {
    icon: String,
    label: String,
  },
};
</script>

<style scoped></style>
