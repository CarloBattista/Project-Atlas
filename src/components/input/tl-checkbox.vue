<template>
  <div class="switch-checkbox relative" :class="{ checked: checked, disabled: disabled }">
    <input hidden type="checkbox" :disabled="disabled" />
    <div class="switch-background">
      <div class="switch-knob"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tl-checkbox',
  props: {
    checked: {
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
.switch-checkbox:not(.disabled) {
  cursor: pointer;
}

.switch-checkbox.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.switch-background {
  position: relative;
  width: 40px;
  height: 24px;
  border-radius: 32px;
  background-color: #e5e5e5;
  box-shadow:
    0 0.5px #fff,
    0 0.5px 1px #0000001f inset;
  transition-property: background-color;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

.switch-knob {
  position: absolute;
  top: 50%;
  left: 2px;
  transform: translateY(-50%);
  height: 20px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #fff;
  box-shadow:
    0 -2px 4px #00000005 inset,
    0 2px 5px #30313d14,
    0 1px 1px #0000001f;
  transition-property: transform, background-color;
  transition-duration: 350ms;
  transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
}

.switch-checkbox.checked .switch-background {
  background-color: rgb(255, 50, 186);
}

.switch-checkbox.checked .switch-knob {
  transform: translate(16px, -50%);
}

.switch-checkbox:not(.disabled):hover .switch-background {
  background-color: #d1d1d1;
}

.switch-checkbox:not(.disabled).checked:hover .switch-background {
  background-color: rgb(209, 0, 150);
}
</style>
