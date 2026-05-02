<template>
  <div class="dropdown-container relative">
    <div @click="isOpen = !isOpen" class="dropdown-trigger">
      <slot name="trigger" />
    </div>
    <div v-if="isOpen" class="dropdown-options shadow-xl shadow-black/5">
      <slot name="options" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'dropdown',
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    handleClickOutside(event) {
      if (this.isOpen && !this.$el.contains(event.target)) {
        this.isOpen = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('touchstart', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('touchstart', this.handleClickOutside);
  },
};
</script>

<style scoped>
.dropdown-options {
  position: absolute;
  z-index: 999999;
  top: 100%;
  right: 0;
  transform: translateY(6px);
  width: max-content;
  padding: 2px;
  border-radius: 12px;
  background-color: #f2f2f2;
}
</style>
