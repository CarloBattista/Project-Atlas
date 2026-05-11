<template>
  <div class="flex gap-4 relative">
    <div v-if="!isLast" class="absolute left-[15px] top-[32px] bottom-[-24px] w-[2px] bg-black/5"></div>
    <div class="z-10 w-8 h-8 rounded-full border border-black/5 bg-white flex items-center justify-center shrink-0">
      <component :is="getIcon(activity.type)" size="14" class="text-gray-400" />
    </div>
    <div class="flex flex-col gap-1 pb-6">
      <div class="flex items-center gap-2">
        <span class="text-sm font-semibold text-black">{{ activity.title }}</span>
        <span class="text-[10px] text-gray-400 font-medium">{{ formatDate(activity.created_at) }}</span>
      </div>
      <p v-if="activity.description" class="text-xs text-gray-500 leading-relaxed">{{ activity.description }}</p>
    </div>
  </div>
</template>

<script>
import { formatDate } from '../../utils/format';

// ICONS
import { Plus, CheckCircle2, AlertCircle, UserPlus, FileUp, Cpu, Clock } from '@lucide/vue';

export default {
  name: 'ActivityItem',
  props: {
    activity: {
      type: Object,
      required: true,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatDate,
    getIcon(type) {
      switch (type) {
        case 'invoice_created':
          return Plus;
        case 'invoice_paid':
          return CheckCircle2;
        case 'invoice_overdue':
          return AlertCircle;
        case 'client_created':
          return UserPlus;
        case 'pdf_uploaded':
          return FileUp;
        case 'ai_processed':
          return Cpu;
        default:
          return Clock;
      }
    },
  },
};
</script>
