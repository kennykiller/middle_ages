<script setup lang="ts">
import { reactive, onBeforeMount, ref, watch } from "vue";
import DatePicker from "@vuepic/vue-datepicker";
import BaseBadge from "@/components/UI/BaseBadge.vue";

type monthNumber =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11";
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
const endDateUTC = new Date(endDate).toUTCString();
const currentDate = new Date().toUTCString();
const isFilmInTheatres = checkTheaters();
const chosenDate = ref("");

const emit = defineEmits<{
  (e: "checkTheaters", val: boolean): void;
}>();
emit("checkTheaters", isFilmInTheatres);

onBeforeMount(() => getDatesInRange(currentDate, endDateUTC));
function checkTheaters() {
  return endDateUTC > currentDate && currentDate > startDateUTC;
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

function format(date:Date) {
  const day = date.getDate();
  const month = String(date.getMonth()) as monthNumber;
  return `Выбранная дата ${day} ${months[month]}`
}
let datesToShow: { day: string; month: string }[] = reactive([]);
watch(chosenDate, (val) => {
  console.log(val);
});



</script>

<template>
  <div class="calendar__wrapper">
    <h2>{{ isFilmInTheatres ? text : "Прокат фильма завершен" }}</h2>
    <div v-if="isFilmInTheatres" class="calendar__slider slider">
      <ul class="slider__items-list">
        <li v-for="date in datesToShow" :key="date.day + date.month">
          <BaseBadge :text="date.day + '\n' + date.month" />
        </li>
        <DatePicker 
          v-model="chosenDate"
          locale="ru"
          placeholder="Другая дата"
          :start-date="startDateUTC"
          :min-date="startDateUTC"
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
    align-items: center;
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