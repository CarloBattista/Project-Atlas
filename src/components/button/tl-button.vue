<template>
  <button :type="type" class="tl-button" :class="['size-' + size, 'variant-' + variant]" :disabled="disabled">
    <span v-if="loading" class="loader"></span>
    <component v-if="!loading && leftIcon" :is="leftIcon" class="icon-button left-icon" />
    <span v-if="!loading && label" class="label-button font-medium whitespace-nowrap">{{ label }}</span>
    <component v-if="!loading && rightIcon" :is="rightIcon" class="icon-button right-icon" />
  </button>
</template>

<script>
// ICONS
import {
  Plus,
  Eye,
  EyeClosed,
  Pen,
  BanknoteArrowUp,
  BanknoteX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserRound,
  Send,
  Download,
  Printer,
} from '@lucide/vue';

export default {
  name: 'tl-button',
  components: {
    // ICONS
    Plus,
    Eye,
    EyeClosed,
    Pen,
    BanknoteArrowUp,
    BanknoteX,
    Trash2,
    ChevronLeft,
    ChevronRight,
    UserRound,
    Send,
    Download,
    Printer,
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
      default: 'primary',
    },
    leftIcon: String,
    label: {
      type: String,
      default: 'Button',
    },
    rightIcon: String,
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
.tl-button {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  transition-property: background-color, color, box-shadow, opacity, transform;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

.tl-button:not(:disabled):active {
  transform: scale(0.95);
}

.tl-button:disabled {
  pointer-events: none;
}

.tl-button:disabled .label-button {
  opacity: 0.5;
}

.icon-button {
  flex: none;
}

/* SIZES */
.tl-button.size-small {
  font-size: 14px;
  height: 36px;
  padding: 8px 12px;
  border-radius: 10px;
}

.tl-button.size-small .icon-button {
  height: 18px;
}

.tl-button.size-default,
.tl-button.size-large {
  font-size: 16px;
  height: 48px;
  padding: 8px 24px;
  border-radius: 12px;
}

.tl-button.size-default .icon-button {
  height: 22px;
}

.tl-button.size-large {
  height: 56px;
}

.tl-button.size-large .icon-button {
  height: 24px;
}

/* VARIANTS */
.tl-button.variant-primary {
  background-color: rgb(23, 23, 23);
  color: rgb(255, 255, 255);
}

.tl-button.variant-primary:hover {
  background-color: rgb(33, 33, 33);
}

.tl-button.variant-secondary {
  background-color: #f5f5f5;
  color: rgb(33, 33, 33);
}

.tl-button.variant-secondary:hover {
  background-color: rgb(0, 0, 0, 0.1);
}

.tl-button.variant-tertiary {
  background-color: rgb(255, 255, 255);
  color: rgb(33, 33, 33);
  box-shadow: 0 0 0 1px #d4d4d4 inset;
}

.tl-button.variant-tertiary:hover {
  background-color: rgba(240, 240, 240, 0.5);
}

.tl-button.variant-link {
  background-color: transparent;
  color: rgb(33, 33, 33);
}

.tl-button.variant-link:hover {
  text-decoration: underline;
}

.tl-button.variant-destructive {
  background-color: rgb(223, 27, 66);
  color: rgb(255, 255, 255);
}

.tl-button.variant-destructive:hover {
  background-color: rgb(185, 22, 55);
}

.tl-button.variant-pulse {
  background-color: rgb(255, 50, 186);
  color: rgb(255, 255, 255);
}

.tl-button.variant-pulse:hover {
  background-color: rgb(209, 0, 150);
}

/* LOADER */
.loader {
  height: 22px;
  aspect-ratio: 1;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  to {
    transform: rotate(360deg);
  }
}

.tl-button.variant-primary .loader {
  border: 4px solid rgb(255, 255, 255);
  border-bottom-color: rgba(240, 240, 240, 0.5);
}

.tl-button.variant-secondary .loader {
  border: 4px solid rgb(23, 23, 23);
  border-bottom-color: rgba(255, 255, 255, 1);
}

.tl-button.variant-tertiary .loader {
  border: 4px solid rgb(23, 23, 23);
  border-bottom-color: rgb(160, 160, 160);
}
</style>
