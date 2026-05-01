<template>
  <div
    class="w-full h-10 px-3 rounded-[10px] flex items-center justify-between bg-transparent hover:bg-white cursor-pointer transition-colors duration-200"
  >
    <div class="flex gap-3 items-center justify-start">
      <component v-if="iconContext" :is="iconContext" size="18" />
      <span v-if="label" class="text-sm font-medium">{{ label }}</span>
    </div>
    <div v-if="rightSection" class="flex gap-1.5 items-center justify-end text-[#656565]">
      <span v-if="rightLabel" class="text-sm font-normal">{{ rightLabel }}</span>
      <component v-if="rightIcon" :is="rightIcon" size="18" />
    </div>
  </div>
</template>

<script>
// ICONS
import { UserRound, Mail, Smartphone, Bell, MonitorSmartphone, MessageCircleQuestionMark, ChevronRight, SquareArrowOutUpRight } from '@lucide/vue';

export default {
  name: 'card-mini',
  components: {
    // ICONS
    UserRound,
    Mail,
    Smartphone,
    Bell,
    MonitorSmartphone,
    MessageCircleQuestionMark,
    ChevronRight,
    SquareArrowOutUpRight,
  },
  props: {
    iconContext: String,
    label: String,
    rightSection: {
      type: Boolean,
      default: true,
    },
    rightLabel: String,
    rightIcon: {
      type: String,
      default: 'ChevronRight',
    },
  },
};
</script>

<style scoped></style>
