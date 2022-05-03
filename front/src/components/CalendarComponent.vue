<script setup lang="ts">
import { computed, reactive, onBeforeMount } from "vue";
import BaseBadge from "@/components/UI/BaseBadge.vue";

interface Props {
  text?: string;
  startDate: string;
  endDate: string;
}

const { text = "Выберите дату", startDate, endDate } = defineProps<Props>();
const startDateUTC = new Date(startDate).toUTCString();
const endDateUTC = new Date(endDate).toUTCString();
const currentDate = new Date().toUTCString();
const isFilmInTheatres = computed(
  () => endDateUTC > currentDate && currentDate > startDateUTC
);
// const howManyDaysLeft = computed(() => {
//   const difInTime =
//     new Date(endDateUTC).getTime() - new Date(currentDate).getTime();
//   return difInTime / (1000 * 3600 * 24);
// });

onBeforeMount(() => getDatesInRange(currentDate, endDateUTC));

function getDatesInRange(currentDate: string, endDateUTC: string) {
  const date = new Date(new Date(currentDate).getTime());
  const endDate = new Date(endDateUTC);
  while (date <= endDate) {
    datesToShow.push(String(new Date(date).getDate()));
    date.setDate(date.getDate() + 1);
    if (datesToShow.length >= 7) {
      break;
    }
  }
}
let datesToShow: string[] = reactive([]);
</script>

<template>
  <div class="calendar__wrapper">
    <h2>{{ isFilmInTheatres ? text : 'Прокат фильма завершен' }}</h2>
    <div class="calendar__slider slider">
      <ul class="slider__items-list">
        <li v-for="date in datesToShow" :key="date">
          <BaseBadge :text="date" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
.calendar {
  &__wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    & > h2 {
      margin-right: 1rem;
    }
  }
  &__slider {
    max-width: 20rem;
  }
}
.slider {
  &__items-list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li:not(:last-child) {
        margin-right: 0.5rem;
    }
  }
}
</style>
