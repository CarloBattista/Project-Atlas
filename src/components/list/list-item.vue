<template>
  <div
    class="listItem w-full px-3 rounded-[10px] flex items-center justify-between bg-transparent hover:bg-white cursor-pointer transition-colors duration-200"
    :class="'listItem-' + type"
  >
    <div class="flex gap-3 items-center justify-start">
      <component v-if="iconContext" :is="iconContext" size="18" />
      <div class="flex flex-col">
        <span v-if="label" class="text-sm font-medium">{{ label }}</span>
        <p v-if="type === 'big' && description" class="text-gray-500 text-xs font-normal">{{ description }}</p>
      </div>
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
  name: 'list-item',
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
    type: {
      type: String,
      default: 'min',
    },
    iconContext: String,
    label: String,
    description: String,
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

<style scoped>
.listItem-min {
  height: 40px;
}

.listItem-big {
  height: 64px;
}
</style>
