<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { Schedules } from "../../../../interfaces/base";
import axios from "axios";
import SessionsComponent from "@/components/sessions/SessionsComponent.vue";
import AdminCalendar from "./AdminCalendar.vue";
import BaseBadge from "../UI/BaseBadge.vue";

let schedules: { value: Schedules[] } | { value: undefined } = reactive({
  value: [],
});
let datesToPass: { value: string[] } | { value: undefined } = reactive({
  value: [],
});

let openedScheduleIdx = ref(0);
let isSaved = ref(false);

onBeforeMount(async () => {
  schedules.value = await getSchedule();
  datesToPass.value = schedules.value?.map((el) => Object.keys(el)).flat();
});

const getSchedule = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(`http://localhost:3000/admin/sessions`, {
      headers,
    });
    if (response.data?.length) return response.data as Schedules[];
  } catch (e) {
    console.log(e);
  }
};

const saveSchedule = async () => {
  try {
    schedules.value?.forEach(async (el) => {
      const dateOfStart = new Date(Object.keys(el)[0]);

      const dataForSave = Object.values(el)[0].map(async (session) => {
        const [hForSave, mForSave, sForSave] =
          Object.keys(session)[0].split(":");

        dateOfStart.setHours(+hForSave);
        dateOfStart.setMinutes(+mForSave);
        dateOfStart.setSeconds(+sForSave);

        if (+hForSave < 8) {
          dateOfStart.setDate(dateOfStart.getDate() + 1);
        }
        const data = Object.values(session)[0];
        console.log({
          filmStart: dateOfStart,
          price: data.price,
          id: data.id,
        });

        await axios.post("http://localhost:3000/admin/sessions", {
          filmStart: dateOfStart.toUTCString(),
          price: data.price,
          id: data.id,
        });
      });
    });
  } catch (e) {
    console.log(e);
  }
  isSaved.value = true;
};
</script>

<template>
  <div class="calendar__wrapper">
    <div v-if="datesToPass.value?.length && !isSaved">
      <BaseBadge @click="saveSchedule" text="Сохранить расписание"></BaseBadge>
    </div>
    <h2 v-if="datesToPass.value?.length">Настройте расписание</h2>
    <h2 v-if="!datesToPass.value?.length">
      На ближайший период расписание уже сохранено
    </h2>
    <div class="films__schedule-wrapper" v-if="datesToPass.value?.length">
      <AdminCalendar
        @open-schedule="openedScheduleIdx = $event"
        :dates="datesToPass.value"
      ></AdminCalendar>
    </div>
    <div class="films__sessions-wrapper" v-if="schedules.value?.length">
      <SessionsComponent
        :data="schedules.value[openedScheduleIdx]"
      ></SessionsComponent>
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
