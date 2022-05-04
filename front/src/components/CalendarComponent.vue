<script setup lang="ts">
import { reactive, onBeforeMount } from "vue";
import BaseBadge from "@/components/UI/BaseBadge.vue";

type monthNumber = '0' | '1' | '2' | '3' | '4'| '5' | '6' | '7' | '8' | '9' | '10' | '11'
interface Props {
  text?: string;
  startDate: string;
  endDate: string;
}

const { text = "Выберите дату", startDate, endDate } = defineProps<Props>();
const months = {
  '0': 'января',
  '1': 'февраля',
  '2': 'марта',
  '3': 'апреля',
  '4': 'мая',
  '5': 'июня',
  '6': 'июля',
  '7': 'августа',
  '8': 'сентября',
  '9': 'октября',
  '10': 'ноября',
  '11': 'декабря'
  }
const startDateUTC = new Date(startDate).toUTCString();
const endDateUTC = new Date(endDate).toUTCString();
const currentDate = new Date().toUTCString();
const isFilmInTheatres = checkTheaters();

const emit = defineEmits<{
    (e: 'checkTheaters', val: boolean):void
}>();
emit('checkTheaters', isFilmInTheatres);

onBeforeMount(() => getDatesInRange(currentDate, endDateUTC));
function checkTheaters() {
    return endDateUTC > currentDate && currentDate > startDateUTC
}

function getDatesInRange(currentDate: string, endDateUTC: string) {
  const date = new Date(new Date(currentDate).getTime());
  const endDate = new Date(endDateUTC);
  while (date <= endDate) {
    datesToShow.push({
      day: String(new Date(date).getDate()),
      month: months[String(new Date(date).getMonth()) as monthNumber]
    });
    date.setDate(date.getDate() + 1);
    if (datesToShow.length >= 7) {
      break;
    }
  }
}
let datesToShow: { day:string, month:string }[] = reactive([]);
</script>

<template>
  <div class="calendar__wrapper">
    <h2>{{ isFilmInTheatres ? text : 'Прокат фильма завершен' }}</h2>
    <div v-if="isFilmInTheatres" class="calendar__slider slider">
      <ul class="slider__items-list">
        <li v-for="date in datesToShow" :key="date.day + date.month">
          <BaseBadge :text="date.day + '\n' + date.month" />
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
