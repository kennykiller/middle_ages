<script setup lang="ts">
const arr = [
  { isBusy: true, id: 1 },
  { isBusy: false, id: 2 },
  { isBusy: true, id: 3 },
  { isBusy: false, id: 4 },
];
</script>

<template>
  <div class="stage">
    <ul class="stage__list">
      <li class="stage__list-item seat" v-for="seat of arr" :key="seat.id">
        <img
          class="seat__image seat__image--busy"
          v-if="seat.isBusy"
          src="@/assets/images/busy-seat.png"
          alt="busy"
        />
        <img
          class="seat__image seat__image--free"
          v-if="!seat.isBusy"
          src="@/assets/images/free-seat.png"
          alt="free"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.stage {
  width: 640px;
  height: 480px;
  position: absolute;
  z-index: 2;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &__list {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    justify-content: space-between;
    align-items: center;
    gap: 2px;
  }
}
</style>
