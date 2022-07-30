<script setup lang="ts">
import { computed } from "@vue/reactivity";
import { SnackType } from "@/interfaces/types";

interface Props {
  text: string;
  mode: SnackType;
}

const props = withDefaults(defineProps<Props>(), {
  text: "Сохранено успешно",
  mode: "success",
});
console.log(props.mode);
const isError = computed(() => props.mode === "error");
</script>

<template>
  <div :class="{ 'snack__wrapper--error': isError }" class="snack__wrapper">
    <p :class="{ 'snack__text--error': isError }" class="snack__text">
      {{ props.text }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.snack {
  &__wrapper {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    padding: 1rem;
    max-width: 25rem;
    border-radius: 5px;
    box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
    background: rgb(153, 226, 226);
    &--error {
      background: rgb(248, 225, 225);
      border-color: rgb(73, 55, 55);
      box-shadow: 0 0 0 4px rgba(black, 0.25);
    }
  }
  &__text {
    color: #266eda;
    &--error {
      color: rgb(87, 80, 80);
    }
  }
}
</style>
