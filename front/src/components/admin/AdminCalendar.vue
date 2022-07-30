<script setup lang="ts">
import { monthNumber } from "@/interfaces/types";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import { computed } from "@vue/reactivity";
interface DateToShow {
  day: string;
  month: string;
}
interface Props {
  dates: string[];
}
const { dates } = defineProps<Props>();
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
const emit = defineEmits<{
  (e: "openSchedule", val: number): void;
}>();

const datesToShow = computed(() => {
  return dates.map((date) => {
    return {
      day: String(new Date(date).getDate()),
      month: months[String(new Date(date).getMonth()) as monthNumber],
    };
  });
});

const constructDate = (date: DateToShow) => {
  const d = +date.day < 10 ? `0${date.day}` : date.day;
  const idx = dates.findIndex((date) => date.split("-")[2] === d);
  emit("openSchedule", idx);
};
</script>
<template>
  <div class="calendar__wrapper">
    <div class="calendar__slider slider">
      <ul class="slider__items-list">
        <li
          @click="constructDate(date)"
          v-for="date of datesToShow"
          :key="date.day + date.month"
        >
          <BaseBadge :text="date.day + '\n' + date.month" />
        </li>
      </ul>
    </div>
  </div>
</template>
