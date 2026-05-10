<template>
  <Transition name="slide-fade">
    <div
      v-if="store.modals[modalKey].isOpen"
      class="modal-container fixed z-99999 top-0 left-0 w-full h-svh md:px-4 md:py-8 px-2 py-4 flex items-center pointer-events-none"
    >
      <div
        class="w-full h-fit max-h-full max-w-[500px] mx-auto rounded-4xl p-5 flex flex-col gap-5 justify-between bg-white shadow-2xl shadow-black/20 pointer-events-auto"
      >
        <!-- HEAD -->
        <div class="w-full flex items-center">
          <div class="flex gap-2 items-center">
            <slot name="back" />
            <h2 v-if="head" class="text-black text-xl font-semibold">{{ head }}</h2>
          </div>
          <tlIconButton v-if="closable" @click="store.modals[modalKey].isOpen = false" size="extra-small" icon="X" class="ml-auto" />
        </div>

        <!-- BODY -->
        <div class="relative w-full h-full min-h-[100px] overflow-y-auto">
          <slot name="body" />
        </div>

        <!-- FOOTER -->
        <div v-if="actions" class="w-full flex gap-3 items-center justify-end">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </Transition>
  <Transition name="fade">
    <div
      v-if="store.modals[modalKey].isOpen"
      @click="store.modals[modalKey].isOpen = false"
      class="overlay-modal fixed z-9999 top-0 left-0 w-full h-svh bg-black opacity-30"
    ></div>
  </Transition>
</template>

<script>
import { store } from '../../data/store';

import tlIconButton from '../button/tl-icon-button.vue';

export default {
  name: 'modal',
  components: {
    tlIconButton,
  },
  props: {
    modalKey: String,
    head: String,
    closable: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      store,
    };
  },
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition-property: opacity, transform;
  transition-duration: 400ms;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: scale(0.95);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
