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
  currentWidePoster: string;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "update-background", val: string): void;
}>();
const urlToSend = getUrl('films', props.url);
const wideUrl = getUrl('films', props.urlBig || props.url);
const isCurrentlyActive = computed(() => props.currentWidePoster === getUrl('films', props.urlBig) || props.currentWidePoster === getUrl('films', props.url))
// const filmTypes = props.genres.map((genre) => genre.name).join(", ");
// const filmRoute = `/films/${props.id}`;
</script>

<template>
  <!-- <Transition name="slide" appear> -->
    <div class="film__container" @click="emit('update-background', wideUrl)">
      <!-- <router-link :to="filmRoute"> -->
        <div :class="{ 'special-box-shadow--active': isCurrentlyActive }" class="special-box-shadow">
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
  margin-right: 1rem;
  align-items: center;
  .special-box-shadow {
    border-radius: 4px;
    min-height: 17rem;
    &--active {
      box-shadow: $yellow-color 0px 4px 12px;
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
