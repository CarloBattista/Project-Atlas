<template>
  <div class="card-info relative flex flex-col rounded-[18px] border border-black/5 bg-white overflow-hidden">
    <div class="w-full h-full p-3">
      <div class="w-full mb-2 flex gap-2 items-center">
        <span v-if="firstLabel" class="text-[#212121]/50 text-xs font-normal">{{ firstLabel }}</span>
        <div v-if="actions" class="relative ml-auto h-5 aspect-square flex items-center text-[#212121]/50 cursor-pointer">
          <EllipsisVertical size="18" />
        </div>
      </div>
      <h2 v-if="head" class="text-black text-xl font-semibold max-one-line">{{ head }}</h2>
      <p v-if="description" class="text-[#212121]/50 text-sm font-medium mt-1.5 max-two-line">{{ description }}</p>
    </div>
    <div v-if="bottomBar" class="w-full min-h-12 max-h-12 px-3 py-2 flex gap-2.5 items-center bg-[#F5F5F5]">
      <component v-if="icon" :is="icon" size="18" />
      <span v-if="bottomLabel" class="text-base font-medium max-one-line">{{ bottomLabel }}</span>
    </div>
  </div>
</template>

<script>
// ICONS
import { Zap, Clock4, EllipsisVertical, Files, Check, Users } from '@lucide/vue';

export default {
  name: 'card-info',
  components: {
    // ICONS
    Zap,
    Clock4,
    EllipsisVertical,
    Files,
    Check,
    Users,
  },
  props: {
    firstLabel: String,
    actions: {
      type: Boolean,
      default: false,
    },
    head: String,
    description: String,
    bottomBar: {
      type: Boolean,
      default: true,
    },
    icon: String,
    bottomLabel: String,
  },
};
</script>

<style scoped></style>
