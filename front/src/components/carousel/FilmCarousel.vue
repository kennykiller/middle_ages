<script setup lang="ts">
import FilmCarouselItem from "./FilmCarouselItem.vue";
import { reactive, onBeforeMount, ref, Ref, computed, watch } from "vue";
import { Film } from "@/interfaces/models";
import { axiosInstance as axios } from "../../utils/axios";
import CarouselNavigation from "./CarouselNavigation.vue";
import ScheduleBadge from "../UI/ScheduleBadge.vue";
import { getUrl } from "@/utils/createUrl";
import { scheduleModule } from "@/store/schedule/schedule";

type direction = 'next' | 'prev';
interface FilmsFromDB {
  films: Film[];
  count: number;
}
interface chosenFilm {
  widePoster: string;
  filmId?: number;
  schedule?: string[];
}

interface Props {
  carouselType: "all" | "upcoming" | "now";
}
const props = defineProps<Props>();

const films: { value: Film[] } = reactive({ value: [] });
const filmsToShow: { value: Film[] } = reactive({ value: [] });
const totalFilmsAmt: Ref<number> = ref(0);
const page = ref(1);
const activeFilm: Ref<Film> = ref({
    name: '',
    ageRestriction: '',
    posterUrl: '',
    posterUrlBig: '',
    description: '',
    startDate: '',
    filmDuration: '',
    basePrice: 300,
    genres: [],
    endDate: ''
});
const chosenFilm: chosenFilm = reactive({
  widePoster: '',
  filmId: undefined,
  schedule: undefined
})

const setFilmId = (id?: number) => chosenFilm.filmId = id;
const slideTo = (film: Film) => {
  activeFilm.value = film;
  setFilmId(film.id);
};
const updateBackground = (url: string) => chosenFilm.widePoster = url;
const choosePage = (val: number) => {
  page.value = val;
  carouselControl();
  setFilmId();
}

const isLastPage = computed(() => {
  return page.value * 4 >= totalFilmsAmt.value;
});
const allFilmsReceived = computed(() => {
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
  setFilmId();
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

watch(activeFilm, async (film) => {
  console.log(film, 'new value');
  await scheduleModule.getSchedule(film.id as number);
  chosenFilm.schedule = scheduleModule.chosenFilm?.time;
})
</script>

<template>
  <div class="carousel__wrapper" :style="{ 'background-image': `url(${chosenFilm.widePoster})` }">
    <div class="carousel__bgc"></div>
    <div class="film-carousel" :class="{ 
      'solo-grid': filmsToShow.value.length === 1,
      'double-grid' : filmsToShow.value.length === 2,
      'triple-grid': filmsToShow.value.length === 3,
      'film-chosen': chosenFilm.filmId
      }">
      <FilmCarouselItem
          v-for="film in filmsToShow.value"
          :key="film.id"
          :url="film.posterUrl"
          :name="film.name"
          :genres="film.genres"
          :id="(film.id as number)"
          :urlBig="film.posterUrlBig || film.posterUrl"
          @click="slideTo(film)"
          @update-background="updateBackground"
        />
    </div>
    <div :class="{ 'film-details--active': chosenFilm.filmId }" class="film-details details">
      <div class="details-genres">{{ activeFilm.genres.map((genre) => genre.name).join(" / ") }}</div>
      <h2 class="details-title">{{ activeFilm.name }}</h2>
      <div class="details-schedule">
        <span v-if="!chosenFilm.schedule?.length">Билетов на этот фильм пока нет.</span>
        <span v-else>Купить билеты:</span>
        <ScheduleBadge v-if="chosenFilm.schedule?.length" class="badge" v-for="time in chosenFilm.schedule" :key="time" :time="time"/>
      </div>
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
    .film-chosen {
      display: none;
    }
  }
  &__bgc {
    position: fixed;
    top: 0;
    left: 7rem;
    background: linear-gradient(#00000080 20%, #00000099 40%, #000000d9 75%);
    width: 100%;
    height: 100%;
  }
}
.film-details {
  display: none;
  flex-direction: column;
  justify-content: center;
  z-index: 100;
  &--active {
    display: flex;
  }
}
.details {
  &-genres {
    color: #fff;
    font-size: 1.5rem;
  }
  &-title {
    color: #fff;
    font-size: 5rem;
    margin: 2rem 0;
  }
  &-schedule {
    display: flex;
    align-items: center;
    span {
      font-size: 1.2rem;
      color: #fff;
      margin-right: 1.5rem;
    }
    .badge:not(:last-child) {
      margin-right: 1.5rem;
    }
  }
}
</style>
