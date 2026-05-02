<template>
  <div class="card-option relative w-full h-22 p-2 rounded-2xl flex gap-3 items-center cursor-pointer" :class="{ active: active }">
    <div class="h-full aspect-square flex items-center justify-center">
      <slot v-if="customIcon" name="customIcon" />
    </div>
    <div class="flex flex-col gap-1">
      <h2 v-if="title" class="text-lg font-semibold">{{ title }}</h2>
      <p v-if="description" class="text-gray-500 text-sm font-normal">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card-option',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    customIcon: {
      type: Boolean,
      default: false,
    },
    title: String,
    description: String,
  },
};
</script>

<style scoped>
.card-option {
  background-color: transparent;
  border: 2px solid rgba(0, 0, 0, 0.1);

  transition-property: background-color, border-color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

.card-option:not(.active):hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.card-option.active {
  background-color: white;
  border: 2px solid black;
}
</style>
