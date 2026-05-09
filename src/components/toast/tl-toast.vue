<template>
  <div
    class="flex items-center p-2 mb-4 rounded-full shadow pointer-events-auto"
    role="alert"
    :class="[typeClasses, type === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-500 dark:text-gray-400 dark:bg-gray-800']"
  >
    <div v-if="showIcon" class="inline-flex items-center justify-center shrink-0 h-8 aspect-square rounded-full" :class="iconContainerClasses">
      <Check v-if="type === 'success'" />
      <X v-if="type === 'error'" />
      <CircleAlert v-else-if="type === 'warning'" />
      <Info v-else-if="type === 'info' || type === 'dark'" />
    </div>
    <div v-if="message" class="mx-3 text-sm font-normal">{{ message }}</div>
    <button
      v-if="closable"
      type="button"
      class="rounded-full cursor-pointer focus:ring-2 focus:ring-gray-300 p-1.5 inline-flex items-center justify-center h-8 w-8"
      :class="
        type === 'dark'
          ? 'bg-black text-white hover:bg-gray-800'
          : 'bg-white text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700'
      "
      aria-label="Close"
      @click="$emit('close')"
    >
      <span class="sr-only">Close</span>
      <X />
    </button>
  </div>
</template>

<script>
// ICONS
import { Check, CircleAlert, Info, X } from '@lucide/vue';

export default {
  name: 'tl-toast',
  components: {
    // ICONS
    Check,
    CircleAlert,
    Info,
    X,
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'error', 'warning', 'dark'].includes(value),
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    closable: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['close'],
  computed: {
    typeClasses() {
      return {
        'border-blue-100 dark:border-blue-800': this.type === 'info',
        'border-green-100 dark:border-green-800': this.type === 'success',
        'border-red-100 dark:border-red-800': this.type === 'error',
        'border-yellow-100 dark:border-yellow-800': this.type === 'warning',
        'border-black-100 dark:border-black-800': this.type === 'dark',
      };
    },
    iconContainerClasses() {
      return {
        'text-blue-500 bg-blue-100 dark:bg-blue-800 dark:text-blue-200': this.type === 'info',
        'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200': this.type === 'success',
        'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200': this.type === 'error',
        'text-yellow-500 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200': this.type === 'warning',
        'text-white bg-black': this.type === 'dark',
      };
    },
  },
};
</script>

<style scoped></style>
