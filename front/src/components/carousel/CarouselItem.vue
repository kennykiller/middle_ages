<script setup lang="ts">
import { Genre } from "../../../../interfaces/models";
interface Props {
  url: string;
  genres: Genre[];
  name: string;
}
const props = defineProps<Props>();
console.log(props);
const url: string = props.url.match(/images(.)+/g)![0] || "";
const filmTypes = props.genres.map((genre) => genre.name).join(", ");
</script>

<template>
  <div class="film__container">
    <div class="special-box-shadow">
      <img :src="require(`@/${url}`)" alt="" class="film__image" />
    </div>
    <div class="film__details">
      <h2>{{ props.name }}</h2>
      <p class="film__genres">{{ filmTypes }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.film__container {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  .special-box-shadow {
    box-shadow: 0 10px 15px -3px rgba(13, 49, 150, 0.8),
      0 4px 6px -4px rgba(0, 0, 0, 0.8);
    background-color: azure;
    border-radius: 4px;
    width: 13rem;
    min-height: 17rem;
    margin-bottom: 0.5rem;
    &:hover .film__image {
      transform: translate(-10px, -10px) scale(1.05);
    }
    .film__image {
      border-radius: 4px;
      height: 100%;
      display: block;
    }
  }
  .film__details {
    text-align: center;
    width: 208px;
    .film__genres {
      font-size: 12px;
    }
  }
}
</style>
