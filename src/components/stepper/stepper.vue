<template>
  <div class="stepper-container relative flex items-center">
    <div class="steps relative w-full flex gap-1.5 items-center">
      <div
        v-for="step in data.total"
        :key="step"
        class="step-background"
        :class="{ active: step === data.current, completed: step < data.current }"
      ></div>
    </div>
    <span v-if="label" class="progress-label w-12 text-end text-sm font-medium">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'stepper',
  props: {
    data: Object,
    label: String,
  },
};
</script>

<style scoped>
.step-background {
  position: relative;
  width: 50%;
  height: 8px;
  border-radius: 32px;
  background-color: #d1d5dc;

  transition-property: width, background-color;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
}

.step-background.active {
  width: 100%;
}

.step-background.active,
.step-background.completed {
  background-color: black;
}
</style>
