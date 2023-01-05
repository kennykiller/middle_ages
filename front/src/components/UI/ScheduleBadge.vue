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
  width: 2.5rem;
  height: 1.5rem;
  padding: 0.5rem;
  background-color: $black-color;
  opacity: 0.6;
  color: $yellow-color;
  transition: all 0.3s ease-out;
  margin: 0 auto;
  &:hover {
    color: $black-color;
    background-color: $yellow-color;
  }
}
</style>