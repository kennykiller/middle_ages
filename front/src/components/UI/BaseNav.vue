<script setup lang="ts">
const emit = defineEmits<{
  (e: "change-page", val: boolean): void;
}>();
</script>

<template>
  <div class="wrapper">
    <div class="round" @click="emit('change-page', true)">
      <slot name="arrow">></slot>
    </div>
    <span>
      <slot name="text">Далее</slot>
    </span>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/vars.scss';
.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.round {
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  background-color: $black-color;
  display: flex;
  align-items: center;
  justify-content: center;
  color: $yellow-color;
  cursor: pointer;
}
span {
  color: $gray-color;
  font-size: 1rem;
}
</style>