<template>
  <component
    :is="isHeader ? 'th' : 'td'"
    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-r border-gray-100 last:border-r-0 cursor-pointer"
    :class="{
      'font-bold': isHeader,
      'hover:bg-gray-100 transition-colors': isHeader && draggable,
      'opacity-50': isDragging,
    }"
    :draggable="isHeader && draggable"
    @dragstart="isHeader && $emit('dragstart', $event)"
    @dragover.prevent="isHeader && $emit('dragover', $event)"
    @drop="isHeader && $emit('drop', $event)"
    @dragend="isHeader && $emit('dragend', $event)"
  >
    <slot />
  </component>
</template>

<script>
export default {
  name: 'tl-table-cell',
  props: {
    isHeader: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    isDragging: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['dragstart', 'dragover', 'drop', 'dragend'],
};
</script>
