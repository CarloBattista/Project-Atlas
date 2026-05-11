<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center gap-2">
      <Activity size="20" class="text-black" />
      <h3 class="text-base font-semibold text-black">Attività</h3>
    </div>
    <!-- Timeline List -->
    <div class="flex flex-col">
      <div
        v-if="activities.length === 0"
        class="py-8 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-100 rounded-2xl"
      >
        <p class="text-gray-400 text-sm">Nessuna attività registrata.</p>
      </div>
      <div v-else-if="loading" class="w-full my-14 flex items-center justify-center">
        <loader />
      </div>
      <div v-else class="flex flex-col">
        <activityItem
          v-for="(activity, index) in sortedActivities"
          :key="activity.id"
          :activity="activity"
          :is-last="index === activities.length - 1"
          :show-time="showTime"
        />
      </div>
      <div v-if="hasMore" class="mt-4 flex justify-center">
        <tlButton @click="$emit('loadMore')" size="small" variant="tertiary" label="Carica altri" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script>
import activityItem from './activity-item.vue';
import tlButton from '../button/tl-button.vue';
import loader from '../global/loader.vue';

// ICONS
import { Activity } from '@lucide/vue';

export default {
  name: 'ActivityTimeline',
  components: {
    activityItem,
    tlButton,
    loader,

    // ICONS
    Activity,
  },
  props: {
    clientId: {
      type: String,
      required: true,
    },
    activities: {
      type: Array,
      default: () => [],
    },
    hasMore: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showTime: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    sortedActivities() {
      return this.activities; // Già ordinati dall'API
    },
  },
};
</script>
