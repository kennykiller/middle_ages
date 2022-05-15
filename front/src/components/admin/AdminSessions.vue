<script setup lang="ts">
import { onBeforeMount, reactive, ref } from "vue";
import { Schedules } from "../../../../interfaces/base";
import axios from "axios";
import SessionsComponent from "@/components/sessions/SessionsComponent.vue";
import AdminCalendar from "./AdminCalendar.vue";

let schedules: { value: Schedules[] } | { value: undefined } = reactive({
  value: [],
});
let datesToPass: { value: string[] } | { value: undefined } = reactive({
  value: [],
});

let openedScheduleIdx = ref(0);

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
</script>

<template>
  <div class="calendar__wrapper">
    <h2>Настройте расписание</h2>
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
