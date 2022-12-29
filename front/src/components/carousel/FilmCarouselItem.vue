<script setup lang="ts">
import { Genre } from "@/interfaces/models";
import { axiosInstance as axios } from "../../utils/axios";
import { getUrl } from "@/utils/createUrl";
interface Props {
  url: string;
  genres: Genre[];
  name: string;
  id: number;
  urlBig: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update-background", val: string): void;
}>();
const urlToSend = getUrl('films', props.url);
const wideUrl = getUrl('films', props.urlBig || props.url);
// const filmTypes = props.genres.map((genre) => genre.name).join(", ");
// const filmRoute = `/films/${props.id}`;
</script>

<template>
  <!-- <Transition name="slide" appear> -->
    <div class="film__container" @click="emit('update-background', wideUrl)">
      <!-- <router-link :to="filmRoute"> -->
        <div class="special-box-shadow">
          <img :src="urlToSend" alt="base-poster" class="film__image" />
        </div>
        <!-- <div v-else class="wide-poster">
          <img :src="urlToSend" alt="wide-poster" class="film__image">
        </div> -->
        <!-- <div class="film__details">
          <h2>{{ props.name }}</h2>
          <p class="film__genres">{{ filmTypes }}</p>
        </div> -->
      <!-- </router-link> -->
    </div>
  <!-- </Transition> -->
</template>

<style lang="scss">
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
.film__container {
  display: flex;
  flex-direction: column;
  height: 100%;
  cursor: pointer;
  margin-right: 1rem;
  align-items: center;
  .special-box-shadow {
    box-shadow: 0 10px 15px -3px rgba(13, 49, 150, 0.8),
      0 4px 6px -4px rgba(0, 0, 0, 0.8);
    background-color: azure;
    border-radius: 4px;
    // width: 13rem;
    min-height: 17rem;
    margin-bottom: 0.5rem;
    &:hover .film__image {
      transform: translate(-10px, -10px) scale(1.05);
    }
    .film__image {
      width: 100%;
      border-radius: 4px;
      height: 400px;
      display: block;
      transition: transform 1s ease;
    }
  }
  .film__details {
    text-align: center;
    width: 208px;
    font-weight: 400;
    h2 {
      margin: 5px;
    }
    .film__genres {
      font-size: 12px;
    }
  }
}
</style>
