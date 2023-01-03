<script setup lang="ts">
import { Genre } from "@/interfaces/models";
import { axiosInstance as axios } from "../../utils/axios";
import { getUrl } from "@/utils/createUrl";
import { computed } from "@vue/reactivity";
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
const filmTypes = props.genres.map((genre) => genre.name).join(" / ");
// const filmRoute = `/films/${props.id}`;
</script>

<template>
  <Transition name="slide" appear>
    <div class="film__container" @click="emit('update-background', wideUrl)">
      <!-- <router-link :to="filmRoute"> -->
        <div class="special-box-shadow">
          <img :src="urlToSend" alt="base-poster" class="film__image" />
          <div class="film__details">
            <h2>{{ props.name }}</h2>
            <p class="film__genres">{{ filmTypes }}</p>
          </div>
        </div>
      <!-- </router-link> -->
    </div>
  </Transition>
</template>

<style lang="scss">
@import '@/assets/styles/vars.scss';
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
  height: 100%;
  cursor: pointer;
  align-items: center;
  &:hover .film__details {
    display: block;
  }
  &:hover .film__image {
    opacity: 0.5;
  }
  &:hover .special-box-shadow {
    box-shadow: $yellow-color 0px 4px 12px;
  }
  .special-box-shadow {
    border-radius: 4px;
    min-height: 17rem;
    position: relative;
    transition: box-shadow .3s ease-out;
    .film__image {
      width: 100%;
      border-radius: 4px;
      height: 400px;
      display: block;
      transition: opacity .3s ease-out;
    }
  }
  .film__details {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    text-align: center;
    width: 208px;
    font-weight: 400;
    margin: 1rem auto 0;
    display: none;
    h2 {
      margin: 5px;
    }
    .film__genres {
      font-size: 12px;
    }
  }
}
</style>
