<script setup lang="ts">
import { computed, onBeforeMount, reactive, Ref, ref } from "vue";
import { Schedules } from "@/interfaces/base";
import { AxiosResponse } from "axios";
import { axiosInstance as axios } from "../../utils/axios";
import SessionsComponent from "@/components/sessions/SessionsComponent.vue";
import AdminCalendar from "./AdminCalendar.vue";
import BaseBadge from "../UI/BaseBadge.vue";
import { CreateSessionResponse } from '@/interfaces/responses';
import BaseSnack from "../UI/BaseSnack.vue";
import { SnackType } from "../../interfaces/types";

let schedules: { value: Schedules[] } | { value: undefined } = reactive({
  value: [],
});
let datesToPass: { value: string[] } | { value: undefined } = reactive({
  value: [],
});

const successText = "Сессия успешно добавлена";
const failureText = "Проблема при создании сессии";
const textToDisplay = computed(() =>
  mode.value === "error" ? failureText : successText
);
let mode: Ref<SnackType> = ref("error");
let snackIsVisible = ref(false);

let openedScheduleIdx = ref(0);
let isSaved = ref(false);

onBeforeMount(async () => {
  schedules.value = await getSchedule();
  datesToPass.value = schedules.value?.map((el) => Object.keys(el)).flat();
});

const getSchedule = async () => {
  try {
    const response = await axios.get(`admin/sessions`);
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

        const response:AxiosResponse<CreateSessionResponse> = await axios.post("admin/sessions", {
          filmStart: dateOfStart.toUTCString(),
          price: data.price,
          filmId: data.id,
        });
        if (response.status === 201) {
          mode.value = response.data?.createdSession?.id ? "success" : "error";
        } else {
          mode.value = "error";
        }
        snackIsVisible.value = true;
        setTimeout(() => (snackIsVisible.value = false), 10000);
      });
    });
  } catch (e) {
    mode.value = "error";
    snackIsVisible.value = true;
    setTimeout(() => (snackIsVisible.value = false), 10000);
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
    <BaseSnack
      v-if="snackIsVisible"
      :text="textToDisplay"
      :mode="mode"
    ></BaseSnack>
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
