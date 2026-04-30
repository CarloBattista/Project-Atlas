<template>
  <button :type="type" class="tl-icon-button" :class="['size-' + size, 'variant-' + variant]" :disabled="disabled">
    <span v-if="loading" class="loader"></span>
    <component v-if="!loading && icon" :is="icon" class="icon-button" />
  </button>
</template>

<script>
// ICONS
import { X, ChevronLeft, ChevronRight, PanelLeftOpen, PanelLeftClose } from '@lucide/vue';

export default {
  name: 'tl-icon-button',
  components: {
    // ICONS
    X,
    ChevronLeft,
    ChevronRight,
    PanelLeftOpen,
    PanelLeftClose,
  },
  props: {
    type: {
      type: String,
      default: 'button',
    },
    size: {
      type: String,
      default: 'default',
    },
    variant: {
      type: String,
      default: 'secondary',
    },
    icon: {
      type: String,
      default: 'X',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.tl-icon-button {
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition-property: background-color, color, box-shadow, opacity, transform;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

.tl-icon-button:not(:disabled):active {
  transform: scale(0.95);
}

.tl-icon-button:disabled {
  pointer-events: none;
}

.tl-icon-button:disabled .icon-button {
  opacity: 0.5;
}

/* SIZES */
.tl-icon-button.size-extra-small {
  height: 28px;
}

.tl-icon-button.size-extra-small .icon-button {
  height: 16px;
}

.tl-icon-button.size-small {
  height: 36px;
}

.tl-icon-button.size-small .icon-button {
  height: 20px;
}

.tl-icon-button.size-default {
  height: 44px;
}

.tl-icon-button.size-default .icon-button {
  height: 24px;
}

.tl-icon-button.size-large {
  height: 56px;
}

.tl-icon-button.size-large .icon-button {
  width: 30px;
  height: 30px;
}

/* VARIANTS */
.tl-icon-button.variant-primary {
  background-color: rgb(23, 23, 3);
  color: rgb(255, 255, 255);
}

.tl-icon-button.variant-primary:hover {
  background-color: rgb(33, 33, 33);
}

.tl-icon-button.variant-secondary {
  background-color: #f5f5f5;
  color: rgb(33, 33, 33);
}

.tl-icon-button.variant-secondary:hover {
  background-color: rgb(0, 0, 0, 0.1);
}

.tl-icon-button.variant-tertiary {
  background-color: rgb(255, 255, 255);
  color: rgb(33, 33, 33);
  box-shadow: 0 0 0 1px #d4d4d4 inset;
}

.tl-icon-button.variant-tertiary:hover {
  background-color: rgba(240, 240, 240, 0.5);
}

.tl-icon-button.variant-link {
  background-color: transparent;
  color: rgb(33, 33, 33);
}

.tl-icon-button.variant-link:hover {
  text-decoration: underline;
}

.tl-icon-button.variant-destructive {
  background-color: rgb(223, 27, 66);
  color: rgb(255, 255, 255);
}

.tl-icon-button.variant-destructive:hover {
  background-color: rgb(185, 22, 55);
}
</style>
