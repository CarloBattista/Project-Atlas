<template>
  <div class="progress-container relative flex items-center">
    <div class="progress-bg relative z-10 w-full h-2 rounded-full bg-gray-300 overflow-hidden">
      <div
        class="progress-bar absolute z-20 top-0 left-0 min-w-0 max-w-full h-full bg-black transition-all duration-300"
        :style="{ width: progress + '%' }"
      ></div>
    </div>
    <span v-if="progressPercentage" class="progress-label w-12 text-end text-sm font-medium">{{ progress }}%</span>
  </div>
</template>

<script>
export default {
  name: 'progress-bar',
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped></style>
