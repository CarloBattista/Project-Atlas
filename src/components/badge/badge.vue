<template>
  <div class="badge relative w-fit px-2.5 py-0.5 rounded-full flex items-center justify-center" :class="'variant-' + variant">
    <span class="text-sm font-medium">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'badge',
  props: {
    variant: {
      type: String,
      default: 'default',
    },
    label: String,
  },
};
</script>

<style scoped>
.badge.variant-success {
  background-color: #dcfce7;
  color: #008236;
}

.badge.variant-warning {
  background-color: #fef9c2;
  color: #a65f00;
}

.badge.variant-danger {
  background-color: #ffe2e2;
  color: #c10007;
}
</style>
