<script setup lang="ts">
interface Props {
  time: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="schedule-badge">{{ props.time }}</div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/vars.scss';
.schedule-badge {
  width: 6rem;
  height: 3rem;
  padding: 0.5rem;
  background-color: $black-color;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  color: $yellow-color;
  transition: all 0.3s ease-out;
  text-align: center;
  cursor: pointer;
  &:hover {
    color: $black-color;
    background-color: $yellow-color;
  }
}
</style>