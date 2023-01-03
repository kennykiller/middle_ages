<script setup lang="ts">
import BaseNav from '../UI/BaseNav.vue';
import { computed } from '@vue/reactivity';

type direction = 'next' | 'prev';
interface Props {
  isLastPage: boolean;
  page: number;
  totalFilmsCount: number;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "change-page", val: direction): void;
  (e: "choose-page", val: number): void;
}>()
const totalPagesAmt = computed(() => Math.ceil(props.totalFilmsCount / 4))
</script>

<template>
  <div class="navigation-wrapper">
    <ul class="navigation-pages navigation__list list">
      <li class="list__item" @click="emit('choose-page', item)" :class="{ 'list__item--active': item === page }" v-for="item in totalPagesAmt" :key="item">
      </li>
    </ul>
    <div class="buttons-wrapper buttons">
      <BaseNav v-if="props.page > 1" @change-page="emit('change-page', 'prev')" class="buttons--prev">
        <template #arrow>
          &lt;
        </template>
        <template #text>
          Назад
        </template>
      </BaseNav>
      <BaseNav v-if="!props.isLastPage" @change-page="emit('change-page', 'next')"></BaseNav>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/vars.scss';

.navigation-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 8rem;
  z-index: 100;
}
.buttons {
  &-wrapper {
    display: flex;
    align-items: center;
  }
  &--prev {
    margin-right: 1rem;
  }
}
.list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 200px;
  height: 40px;
  &__item {
    cursor: pointer;
    height: .5rem;
    width: .5rem;
    &::after {
        position: absolute;
        z-index: 10;
        content: '';
        height: 4px;
        width: 4px;
        border-radius: 50%;
        color: $gray-color;
        background: $gray-color;
        box-shadow: 0 0 5px 3px;
    }
  }
  &__item--active {
    &::after {
      color: $yellow-color;
      background: $yellow-color;
    }
  }
}
</style>