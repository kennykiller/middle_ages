<script setup lang="ts">
interface Props {
  url: string;
  description: string;
  name: string;
  discountPercentage: string;
}
const props = defineProps<Props>();
const url: string = props.url.match(/images(.)+/g)![0] || "";
</script>

<template>
  <div class="discount__container">
    <div class="special-box-shadow">
      <img :src="require(`@/${url}`)" alt="" class="discount__image" />
    </div>
    <div class="discount__details">
      <h2>{{ props.name }}</h2>
      <p class="discount__description">{{ props.description }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.discount__container {
  display: flex;
  flex-direction: column;
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
