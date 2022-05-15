<script setup lang="ts">
import { reactive, onBeforeMount, ref } from "vue";
import DatePicker from "@vuepic/vue-datepicker";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import { monthNumber } from "../../../interfaces/types";

type filmStart = "past" | "now" | "future";
interface Props {
  text?: string;
  startDate: string;
  endDate: string;
}

const { text = "Выберите дату", startDate, endDate } = defineProps<Props>();
const months = {
  "0": "января",
  "1": "февраля",
  "2": "марта",
  "3": "апреля",
  "4": "мая",
  "5": "июня",
  "6": "июля",
  "7": "августа",
  "8": "сентября",
  "9": "октября",
  "10": "ноября",
  "11": "декабря",
};
const startDateUTC = new Date(startDate).toUTCString();
const startDateTime = new Date(startDate).getTime();
const endDateUTC = new Date(endDate).toUTCString();
const endDateTime = new Date(endDate).getTime();
const currentDate = new Date().toUTCString();
const currentDateTime = new Date().getTime();
const isFilmInTheatres = checkTheaters();
const calendarStartDate = calcStartDate();
const chosenDate = ref("");

const emit = defineEmits<{
  (e: "checkTheaters", val: filmStart): void;
}>();
emit("checkTheaters", isFilmInTheatres);

onBeforeMount(() => getDatesInRange(calendarStartDate, endDateUTC));
function checkTheaters() {
  if (endDateTime > currentDateTime && currentDateTime > startDateTime) {
    return "now";
  }
  if (endDateTime > currentDateTime && currentDateTime < startDateTime) {
    return "future";
  }
  return "past";
}

function calcStartDate() {
  return isFilmInTheatres === "now" ? currentDate : startDateUTC;
}

function getDatesInRange(currentDate: string, endDateUTC: string) {
  const date = new Date(new Date(currentDate).getTime());
  const endDate = new Date(endDateUTC);
  while (date <= endDate) {
    datesToShow.push({
      day: String(new Date(date).getDate()),
      month: months[String(new Date(date).getMonth()) as monthNumber],
    });
    date.setDate(date.getDate() + 1);
    if (datesToShow.length >= 7) {
      break;
    }
  }
}

function format(date: Date) {
  const day = date.getDate();
  const month = String(date.getMonth()) as monthNumber;
  return `Выбранная дата ${day} ${months[month]}`;
}
let datesToShow: { day: string; month: string }[] = reactive([]);
</script>

<template>
  <div class="calendar__wrapper">
    <h2>
      {{
        isFilmInTheatres === "now"
          ? text
          : isFilmInTheatres === "future"
          ? "Скоро в прокате"
          : "Прокат фильма завершен"
      }}
    </h2>
    <div v-if="isFilmInTheatres != 'past'" class="calendar__slider slider">
      <ul class="slider__items-list">
        <li v-for="date in datesToShow" :key="date.day + date.month">
          <BaseBadge :text="date.day + '\n' + date.month" />
        </li>
        <DatePicker
          v-model="chosenDate"
          locale="ru"
          placeholder="Другая дата"
          :start-date="calendarStartDate"
          :min-date="calendarStartDate"
          :max-date="endDateUTC"
          :enable-time-picker="false"
          :auto-apply="true"
          utc
          :format="format"
        ></DatePicker>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import "@vuepic/vue-datepicker/src/VueDatePicker/style/main.scss";
.calendar {
  &__wrapper {
    display: flex;
    width: 80%;
    flex-direction: column;
    align-items: center;
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
.dp {
  &__main {
    height: 76px;
    & > div {
      height: 100%;
      width: 100%;
    }
  }
  &__input {
    height: 100%;
    width: auto;
    box-shadow: 0 4px 15px #88b8fe;
    &:hover,
    &:active {
      color: #88b8fe;
      border-color: #88b8fe;
      box-shadow: 0 0 0 4px rgba(#88b8fe, 0.25);
    }
    &_wrap {
      height: 100%;
      min-width: 155px;
    }
  }
}
</style>
