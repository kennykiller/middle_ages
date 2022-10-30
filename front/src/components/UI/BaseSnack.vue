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
    left: 0.7rem;
    bottom: 1.6rem;
    padding: 1rem;
    max-width: 25rem;
    border-radius: 4px;
    color: #000;
    box-shadow: 1px 2px 20px 4px rgb(0 150 0 / 75%);
    background: #fff;
    &--error {
      box-shadow: 1px 2px 10px 2px rgb(255 20 40 / 75%);
    }
  }
  &__text {
    font-size: 18px;
  }
}
</style>
