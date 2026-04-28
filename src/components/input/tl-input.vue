<template>
  <div
    @click="focusInput"
    class="field-container relative"
    :class="{ focus: focus, error: error, success: success, disabled: disabled, 'has-value': modelValue }"
  >
    <div class="input-container relative w-full h-14 rounded-xl">
      <label v-if="label" :for="forLabel" class="input-label absolute z-10 ml-4 text-[#707070]">{{ label }}</label>
      <div class="absolute z-0 top-0 left-0 w-full px-4 pt-7 pb-2">
        <input
          ref="inputElement"
          @focus="handleFocus"
          @blur="handleBlur"
          @input="updateValue"
          :value="modelValue"
          :id="forLabel"
          :type="inputType"
          :placeholder="placeholder"
          :disabled="disabled"
          class="input-field w-full h-full outline-0"
        />
      </div>
    </div>
    <div v-if="error" class="error-container relative w-full mt-1">
      <p class="error-message text-[#df1b41] text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tl-input',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    forLabel: String,
    label: String,
    placeholder: String,
    error: String,
    required: Boolean,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focus: false,
      showPassword: false,
    };
  },
  computed: {
    inputType() {
      if (this.type === 'password') {
        return this.showPassword ? 'text' : 'password';
      }
      return this.type;
    },
  },
  methods: {
    updateValue(event) {
      if (this.disabled) return;

      this.$emit('update:modelValue', event.target.value);
    },
    handleFocus() {
      this.focus = true;
    },
    handleBlur() {
      this.focus = false;
    },
    focusInput() {
      if (!this.disabled && !this.readOnly) {
        this.$refs.inputElement.focus();
      }
    },
    toggleShowPassword() {
      if (this.type !== 'password') return;

      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
.input-container {
  background-color: rgb(245, 245, 245);

  transition-property: background-color, box-shadow;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

.field-container.focus .input-container {
  box-shadow: 0 0 0 1.5px #171717 inset;
}

.field-container:not(.focus).error .input-container {
  box-shadow: 0 0 0 1.5px #df1b41 inset;
}

.field-container:not(.focus).warning .input-container {
  box-shadow: 0 0 0 1.5px #e69e2c inset;
}

.field-container:not(.focus).success .input-container {
  box-shadow: 0 0 0 1.5px #30b130 inset;
}

.field-container.disabled {
  pointer-events: none;
  opacity: 0.5;
}

.input-label {
  font-size: 1rem;
  top: 50%;
  transform: translateY(-50%);

  transition-property: font-size, transform;
  transition-duration: 150ms;
  transition-timing-function: ease-in-out;
}

.field-container.focus .input-label,
.field-container.has-value .input-label {
  font-size: 0.75rem;
  transform: translateY(-18px);
}
</style>
