<script setup lang="ts">
import { computed } from "vue";
import { getUrl } from "@/utils/createUrl"
interface Props {
  url: string;
  description: string;
  name: string;
  discountPercentage: string;
}
const props = defineProps<Props>();
const urlToSend = getUrl('discounts', props.url);
const fullName = computed(
  () => `${props.name}`
);
</script>

<template>
  <Transition name="slide" appear>
    <div class="discount__container">
      <div class="special-box-shadow">
        <img :src="urlToSend" alt="" class="discount__image" />
      </div>
      <div class="discount__details">
        <h2>{{ fullName }}</h2>
        <p class="discount__description">{{ props.description }}</p>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@keyframes slide-in {
  from {
    transform: translateX(150px);
    opacity: 0;
  }
  to {
    transform: translate(0);
    opacity: 1;
  }
}
.slide-enter-active {
  animation: slide-in 1s;
}
.discount__container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  margin-right: 1rem;
  .special-box-shadow {
    box-shadow: 0 10px 15px -3px rgba(13, 49, 150, 0.8),
      0 4px 6px -4px rgba(0, 0, 0, 0.8);
    background-color: azure;
    border-radius: 4px;
    width: 13rem;
    min-height: 17rem;
    margin-bottom: 0.5rem;
    &:hover .discount__image {
      transform: translate(-10px, -10px) scale(1.05);
    }
    .discount__image {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      display: block;
      transition: transform 1s ease;
    }
  }
  .discount__details {
    text-align: center;
    width: 208px;
    .discount__description {
      font-size: 12px;
    }
  }
}
</style>
