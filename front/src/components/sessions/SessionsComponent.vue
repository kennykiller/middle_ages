<script setup lang="ts">
import SessionItem from "./SessionItem.vue";
import { Schedules } from "../../../../interfaces/base";
import { computed } from "@vue/reactivity";

interface Props {
  data: Schedules;
}

const props = defineProps<Props>();
const sessions = computed(() => {
  return Object.values(props.data)[0];
});
</script>

<template>
  <div class="sessions__wrapper">
    <h2>Выберите удобное время</h2>
    <SessionItem
      v-for="(session, i) of sessions"
      :key="i"
      :time="Object.keys(session)[0]"
      :name="Object.values(session)[0].name"
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
