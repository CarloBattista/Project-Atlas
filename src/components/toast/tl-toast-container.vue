<template>
  <div class="fixed z-9999 top-3 left-0 w-full flex flex-col justify-center items-center pointer-events-none">
    <TransitionGroup name="toast" tag="div" class="w-full flex flex-col items-center">
      <tlToast
        v-for="toast in toasts"
        :key="toast.id"
        :message="toast.message"
        :type="toast.type"
        :showIcon="toast.showIcon"
        :closable="toast.closable"
        @close="removeToast(toast.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script>
import { computed } from 'vue';
import { toastState, removeToast } from '../../utils/toast';

import tlToast from './tl-toast.vue';

export default {
  name: 'tlToastContainer',
  components: {
    tlToast,
  },
  setup() {
    const toasts = computed(() => toastState.toasts);

    return {
      toasts,
      removeToast,
    };
  },
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.toast-move {
  transition: transform 0.3s ease;
}
</style>
