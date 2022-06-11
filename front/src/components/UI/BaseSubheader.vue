<script setup lang="ts">
import BaseBadge from "@/components/UI/BaseBadge.vue";
interface Props {
  subtitle: string;
  allDataReceived: boolean;
  page: number;
  isLastPage: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "prevPage"): void;
  (e: "nextPage"): void;
}>();
</script>

<template>
  <div class="subheader__container">
    <BaseBadge :text="props.subtitle" />
    <div class="arrows__container">
      <BaseBadge v-if="page > 1" @click="emit('prevPage')" class="arrow">
        <template #image>
          <img src="@/assets/images/back.png" alt="back" />
        </template>
      </BaseBadge>
      <BaseBadge
        v-if="!allDataReceived || !isLastPage"
        @click="emit('nextPage')"
        class="arrow"
      >
        <template #image>
          <img src="@/assets/images/forward.png" alt="" />
        </template>
      </BaseBadge>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.subheader__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding: 0 10px;
  &::v-deep > .badge__wrapper {
    width: max-content;
    cursor: auto;
    &:hover {
      border-color: #ced4da;
      box-shadow: 0 4px 15px #88b8fe;
    }
  }
}
.arrows__container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  height: 3rem;
  .arrow {
    cursor: pointer;
    &:hover img {
      transform: scale(1.5);
    }
  }
  .arrow,
  .arrow img {
    width: 1.5rem;
    transition: transform 0.4s ease;
  }
}
</style>
