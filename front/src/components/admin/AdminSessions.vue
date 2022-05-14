<script setup lang="ts">
import { onBeforeMount, reactive, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import { Film, Genre } from "../../../interfaces/models";
import axios from "axios";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import SessionsComponent from "@/components/sessions/SessionsComponent.vue";

onBeforeMount(async () => {
  const res = await getSchedule();
});

const getSchedule = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(`http://localhost:3000/admin/sessions`, {
      headers,
    });
    console.log(response.data);
    return response;
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="calendar__wrapper">
    <h2>Настройте расписание</h2>
    <div class="films__schedule-wrapper">
      <CalendarComponent
        text="Выберите дату"
        :start-date="film.value.startDate"
        :end-date="film.value.endDate"
      ></CalendarComponent>
    </div>
    <div class="films__sessions-wrapper">
      <SessionsComponent></SessionsComponent>
    </div>
  </div>
</template>

<style lang="scss">
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
.films {
  &__schedule-wrapper {
    display: flex;
    justify-content: center;
  }
}
</style>
