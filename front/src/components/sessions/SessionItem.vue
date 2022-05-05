<script setup lang="ts">
interface Props {
  time: string;
  price: string;
  placesLeft: string;
}

const { time, price, placesLeft } = defineProps<Props>();
</script>

<template>
  <div class="session__wrapper">
    <div class="session__info-wrapper">
      <span>Начало сеанса: {{ time }}</span>
      <span>Стоимость: {{ price }} руб</span>
      <span>Осталось {{ placesLeft }} мест</span>
    </div>
    <div class="session__confirm">
      <button>Выбрать место</button>
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
    &:hover,
    &:active {
      border-color: #88b8fe;
      box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
    }
  }
  &__info-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    padding: 0.5rem;
    span {
      font-size: 1.5rem;
    }
  }
  &__confirm {
    margin: 0 auto;
    padding: 1rem 0;
    button {
        font-size: 1.3rem;
        padding: .3rem;
    }
  }
}
</style>
