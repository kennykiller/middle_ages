<script setup lang="ts">
interface Props {
  isOpened: Boolean;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close", val: Boolean): void;
}>();
</script>

<template>
  <div v-if="props.isOpened" @click="emit('close', true)" class="dialog">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.dialog {
  width: 100vw;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
}
</style>
