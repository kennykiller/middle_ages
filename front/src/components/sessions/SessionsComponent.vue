<script setup lang="ts">
import SessionItem from "./SessionItem.vue";
import { DailySchedule, Schedules } from "../../../../interfaces/base";
import { computed, ref, Ref } from "@vue/reactivity";

interface Props {
  data: Schedules;
}

const props = defineProps<Props>();
const sessions = computed(() => {
  return Object.values(props.data)[0];
});
const idxOfDraggableSession = ref(0);
const idxOfDraggingOverSession = ref(0);
const isDragging = ref(false);
const handleOnDragOver = (e: DragEvent, idx: number) => {
  idxOfDraggingOverSession.value = idx;
};
const handleOnDrop = (e: DragEvent) => {
  isDragging.value = false;
  arrayMove(
    Object.values(props.data)[0],
    idxOfDraggableSession,
    idxOfDraggingOverSession
  );
};
const handleDragStart = (e: DragEvent, idx: number) => {
  isDragging.value = true;
  idxOfDraggableSession.value = idx;
};
const arrayMove = (
  arr: DailySchedule[],
  fromIndex: Ref<number>,
  toIndex: Ref<number>
) => {
  const element = arr[fromIndex.value];
  arr.splice(fromIndex.value, 1);
  arr.splice(toIndex.value, 0, element);
};
</script>

<template>
  <div class="sessions__wrapper">
    <h2>Выберите удобное время</h2>
    <div
      @dragenter.prevent
      @dragover.prevent
      @drop="handleOnDrop"
      class="sessions__droppable"
    >
      <SessionItem
        v-for="(session, i) of sessions"
        :key="i"
        :time="Object.keys(session)[0]"
        :draggable="true"
        @dragover="handleOnDragOver($event, i)"
        @dragstart="handleDragStart($event, i)"
        :name="Object.values(session)[0].name"
        :price="String(Object.values(session)[0]?.price)"
        :dragged-over="
          isDragging &&
          idxOfDraggingOverSession === i &&
          idxOfDraggingOverSession !== idxOfDraggableSession
        "
        :dragging="isDragging && idxOfDraggableSession === i"
      ></SessionItem>
    </div>
  </div>
</template>

<style lang="scss">
.sessions {
  &__wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
  }
  &__droppable {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
}
</style>
