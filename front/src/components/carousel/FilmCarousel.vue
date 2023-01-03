<script setup lang="ts">
import FilmCarouselItem from "./FilmCarouselItem.vue";
import { reactive, onBeforeMount, ref, Ref, computed } from "vue";
import { Film } from "@/interfaces/models";
import { axiosInstance as axios } from "../../utils/axios";
import CarouselNavigation from "./CarouselNavigation.vue";
import { getUrl } from "@/utils/createUrl";

type direction = 'next' | 'prev';
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
const totalFilmsAmt: Ref<number> = ref(0);
const page = ref(1);
const currentSlide = ref(0);
const widePoster = ref('');
const slideTo = (val: number) => currentSlide.value = val;
const updateBackground = (url: string) => widePoster.value = url;
const choosePage = (val: number) => {
  page.value = val;
  carouselControl();
}

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
  }
  updateBackground(getUrl('films', filmsToShow.value[0].posterUrlBig || filmsToShow.value[0].posterUrl))
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

function changePage(mode: direction) {
  mode === 'next' ? page.value++ : page.value--;
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
    <div class="carousel__bgc"></div>
    <div class="film-carousel" :class="{ 'solo-grid': filmsToShow.value.length === 1, 'double-grid' : filmsToShow.value.length === 2, 'triple-grid': filmsToShow.value.length === 3 }">
      <FilmCarouselItem
          v-for="(film, idx) in filmsToShow.value"
          :key="film.id"
          :url="film.posterUrl"
          :name="film.name"
          :genres="film.genres"
          :id="(film.id as number)"
          :urlBig="film.posterUrlBig || film.posterUrl"
          @click="slideTo(idx)"
          @update-background="updateBackground"
        />
    </div>
    <CarouselNavigation
      :totalFilmsCount="totalFilmsAmt"
      :page="page"
      :isLastPage="isLastPage"
      @change-page="changePage"
      @choose-page="choosePage"
    ></CarouselNavigation>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  &__wrapper {
    height: 100%;
    width: 100%;
    background-size: cover;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: rgb(0, 0, 0, .3);
    position: relative;
    transition: background-image .5s ease-in-out;
    .film-carousel {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      justify-items: center;
      width: 100%;
      padding: 10px 5px;
      border-radius: 0.5rem;
      min-height: 400px;
      padding: 1rem 0;
      background-color: rgb(0, 0, 0, .7);
    }
    .solo-grid {
      grid-template-columns: 1fr;
    }
    .double-grid {
      grid-template-columns: 1fr 1fr;
    }
    .triple-grid {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
  &__bgc {
    position: fixed;
    top: 0;
    left: 7rem;
    background-color: rgb(0, 0, 0, .6);
    width: 100%;
    height: 100%;
  }
}
</style>
