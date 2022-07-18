<script setup lang="ts">
interface Props {
  time: string;
  price: string;
  id?: number;
  placesLeft?: string;
  name?: string;
  draggedOver?: boolean;
  dragging?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "choose-session", val: Props["id"]): void;
}>();
</script>

<template>
  <div
    :class="{
      'is-dragging': props.dragging,
      'is-dragged-over': props.draggedOver,
    }"
    class="session__wrapper"
  >
    <div class="session__info-wrapper">
      <span v-if="props.name"
        >Название фильма:<br />
        <span class="session__info-name">{{ props.name }}</span></span
      >
      <span
        >Начало сеанса:<br />
        <span class="session__info-title">{{ props.time }}</span></span
      >
      <span
        >Стоимость:<br />
        <span class="session__info-price">{{ props.price }} руб</span></span
      >
      <span v-if="props.placesLeft"
        >Осталось мест:<br /><span class="session__info-places">{{
          props.placesLeft
        }}</span></span
      >
    </div>
    <div v-if="props.placesLeft" class="session__confirm">
      <button @click="emit('choose-session', props.id)">Выбрать место</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/base-button.scss";
.session {
  &__wrapper {
    width: 80%;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 15px #88b8fe;
    border: 1px solid #ced4da;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    &:hover,
    &:active {
      border-color: #88b8fe;
      box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  &__info {
    &-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      justify-items: center;
      padding: 0.5rem;
      span {
        font-size: 1rem;
        text-align: center;
      }
    }
    &-name,
    &-title,
    &-price,
    &-places {
      font-size: 1.2rem !important;
      color: black;
    }
  }

  &__confirm {
    margin: 0 auto;
    padding: 1rem 0;
    button {
      font-size: 1.3rem;
      padding: 0.3rem;
    }
  }
}
.is-dragging {
  background: rgb(114, 204, 114);
}
.is-dragged-over {
  background: rgb(243, 192, 192);
}
</style>
