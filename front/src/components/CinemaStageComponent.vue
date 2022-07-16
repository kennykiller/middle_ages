<script setup lang="ts">
import { reactive } from "vue";
const arr: { isBusy: Boolean; id: number; isBooked: boolean }[] = reactive([]);
const rows = [...Array(11).keys()].slice(1);
const chosenSeats: { isBusy: Boolean; id: number; isBooked: boolean }[] =
  reactive([]);
let id = 1;
while (arr.length < 100) {
  arr.push(
    { isBusy: false, id: id++, isBooked: false },
    { isBusy: true, id: id++, isBooked: false }
  );
}
const toggleBooking = (idx: number) => {
  arr[idx].isBooked = !arr[idx].isBooked;
  if (arr[idx].isBooked) {
    chosenSeats.push(arr[idx]);
  } else {
    const idxToRemove = chosenSeats.findIndex(
      (seat) => seat.id === arr[idx].id
    );
    chosenSeats.splice(idxToRemove, 1);
  }
};
</script>

<template>
  <div class="stage">
    <div class="stage__screen"><span>Экран</span></div>
    <div class="stage__scheme scheme">
      <ul class="scheme__rows">
        <li class="scheme__row" v-for="row of rows" :key="row">
          <span>{{ row }}</span>
        </li>
      </ul>
      <ul class="stage__list">
        <li
          class="stage__list-item seat"
          v-for="(seat, idx) of arr"
          :key="seat.id"
        >
          <img
            class="seat__image seat__image--busy"
            v-if="seat.isBusy && !seat.isBooked"
            src="@/assets/images/busy-seat.png"
            alt="busy"
          />
          <img
            class="seat__image seat__image--free"
            v-if="!seat.isBusy && !seat.isBooked"
            src="@/assets/images/free-seat.png"
            @click="toggleBooking(idx)"
            alt="free"
          />
          <img
            class="seat__image seat__image--booked"
            v-if="seat.isBooked"
            @click="toggleBooking(idx)"
            src="@/assets/images/booked-seat.png"
            alt="booked"
          />
        </li>
      </ul>
    </div>
    <div class="stage__info info">
      <div class="info__warning" v-if="!chosenSeats.length">
        Выберите свободные места (указаны зеленым)
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stage {
  width: 640px;
  position: absolute;
  padding: 20px;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 7px #88b8fe;
  &__screen {
    width: 90%;
    height: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 0 auto;
    box-shadow: 0 4px 7px #88b8fe;
  }
  &__scheme {
    display: flex;
    align-items: center;
  }
  &__list {
    display: grid;
    width: 90%;
    margin: 15px auto 0;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    align-items: center;
    justify-items: center;
    gap: 2px;
    &-item {
      height: 24px;
      img {
        height: 24px;
      }
    }
    &-item:hover .seat__image--free {
      transform: scale(1.2);
    }
  }
}
.scheme__rows {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: 15px 0 0;
  & .scheme__row {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.seat__image--free,
.seat__image--booked {
  cursor: pointer;
  transition: transform 0.4s ease;
}
</style>
