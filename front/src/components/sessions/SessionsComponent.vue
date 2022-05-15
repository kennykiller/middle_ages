<script setup lang="ts">
import SessionItem from "./SessionItem.vue";
import { Schedules } from "../../../../interfaces/base";
import { reactive } from "vue";

interface Props {
  data: Schedules;
}

const { data } = defineProps<Props>();
console.log(data);

const sessions = reactive({ value: Object.values(data)[0] });
console.log(sessions);
console.log(sessions.value.forEach((s) => console.log(s)));
</script>

<template>
  <div class="sessions__wrapper">
    <h2>Выберите удобное время</h2>
    <SessionItem
      v-for="(session, i) of sessions.value"
      :key="i"
      :time="Object.keys(session)[0]"
      price="500"
    ></SessionItem>
  </div>
</template>

<style lang="scss">
.sessions__wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}
</style>
