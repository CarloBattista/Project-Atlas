<template>
  <span class="loader"></span>
</template>

<script>
export default {
  name: 'loader',
};
</script>

<style scoped>
.loader {
  border: 4px solid rgb(23, 23, 23);
  border-bottom-color: rgba(255, 255, 255, 1);
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
</style>
