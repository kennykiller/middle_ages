<script setup lang="ts">
import FilmCarouselItem from "./FilmCarouselItem.vue";
import { reactive, onBeforeMount, ref, Ref, computed } from "vue";
import { Film } from "@/interfaces/models";
import { axiosInstance as axios } from "../../utils/axios";
import BaseSubheader from "../UI/BaseSubheader.vue";
import { Carousel, Pagination, Slide } from 'vue3-carousel';

import 'vue3-carousel/dist/carousel.css'

type mode = "inc" | "dec";
interface FilmsFromDB {
  films: Film[];
  count: number;
}

interface Props {
  carouselType: "all" | "upcoming" | "now";
}
const props = defineProps<Props>();

const films: { value: Film[] } = reactive({ value: [] });
const filmsToShow: { value: Film[] } = reactive({ value: [] });
let totalFilmsAmt: Ref<number> = ref(0);
const page = ref(1);
const currentSlide = ref(0);
const widePoster = ref('');
const slideTo = (val:number) => currentSlide.value = val;
const updateBackground = (url:string) => widePoster.value = url;

let isLastPage = computed(() => {
  return page.value * 4 >= totalFilmsAmt.value;
});
let allFilmsReceived = computed(() => {
  return totalFilmsAmt.value === films.value.length;
});

onBeforeMount(async () => {
  const res: FilmsFromDB = await getFilms(page.value);
  if (res?.count) {
    ({ films: films.value, count: totalFilmsAmt.value } = res);
  }
  if (films.value.length > 4) {
    filmsToShow.value = films.value.slice(0, 4);
  } else {
    filmsToShow.value = films.value.slice(0);
    console.log(filmsToShow.value);
  }
});
const getFilms = async (page: number) => {
  try {
    const url = `films/${props.carouselType}?page=${page}`;
    const response = await axios.get(url);
    if (response?.data?.count) {
      return response.data;
    }
    return [];
  } catch (e) {
    console.log(e);
  }
};

function changePage(mode: mode) {
  mode === "inc" ? page.value++ : page.value--;
  carouselControl();
}

const carouselControl = async () => {
  if (allFilmsReceived.value) {
    filmsToShow.value = films.value.slice((page.value - 1) * 4, page.value * 4);
  } else if (page.value === 1) {
    filmsToShow.value = films.value.slice(0, 4);
  } else {
    const res: FilmsFromDB = await getFilms(page.value);
    if (
      res.count &&
      !films.value.find((film) => res.films.some((v) => v.id === film.id))
    ) {
      res.films.forEach((film) => films.value.push(film));
    }
    filmsToShow.value = films.value.slice((page.value - 1) * 4, page.value * 4);
  }
};
</script>

<template>
  <div class="carousel__wrapper" :style="{ 'background-image': `url(${widePoster})` }">
    <Carousel
      id="thumbnails"
      :items-to-show="4"
      :wrap-around="true"
      v-model="currentSlide"
      ref="carousel"
    >
      <Slide v-for="(film, idx) in filmsToShow.value" :key="idx">
        <FilmCarouselItem
          :url="film.posterUrl"
          :name="film.name"
          :genres="film.genres"
          :id="(film.id as number)"
          :urlBig="film.posterUrlBig || film.posterUrl"
          @click="slideTo(idx)"
          @update-background="updateBackground"
        />
      </Slide>
    </Carousel>
  </div>
</template>

<style lang="scss" scoped>
.carousel__wrapper {
  height: 100%;
  width: 100%;
  background-size: cover;
}
.carousel {
  height: 400px;
  &__viewport {
    height: 100%;
  }
  &__track {
    height: 100%;
  }
}
.current-films__container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .film-carousel {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    background: #fff;
    padding: 10px 5px;
    border-radius: 0.5rem;
    box-shadow: 0 4px 15px #88b8fe;
    div {
      transition: opacity 0.6s ease;
    }
    &:hover div {
      opacity: 0.5;
    }
    div:hover {
      opacity: 1;
    }
  }
}
</style>
