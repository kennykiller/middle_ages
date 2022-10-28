<script setup lang="ts">
import FilmCarouselItem from "./FilmCarouselItem.vue";
import { reactive, onBeforeMount, ref, Ref, computed } from "vue";
import { Film } from "@/interfaces/models";
import { axiosInstance as axios } from "../../utils/axios";
import BaseSubheader from "../UI/BaseSubheader.vue";

type mode = "inc" | "dec";
interface FilmsFromDB {
  rows: Film[];
  count: number;
}

interface Props {
  carouselType: "all" | "upcoming";
}
const props = defineProps<Props>();

const films: { value: Film[] } = reactive({ value: [] });
const filmsToShow: { value: Film[] } = reactive({ value: [] });
let totalFilmsAmt: Ref<number> = ref(0);
let page = ref(1);

let isLastPage = computed(() => {
  console.log(page.value * 4 >= totalFilmsAmt.value, "is last page");

  return page.value * 4 >= totalFilmsAmt.value;
});
let allFilmsReceived = computed(() => {
  return totalFilmsAmt.value === films.value.length;
});

onBeforeMount(async () => {
  const res: FilmsFromDB = await getFilms(page.value);
  if (res.count) {
    ({ rows: films.value, count: totalFilmsAmt.value } = res);
  }
  if (films.value.length > 4) {
    filmsToShow.value = films.value.slice(0, 4);
  } else {
    filmsToShow.value = films.value.slice(0);
    console.log(filmsToShow.value);
  }
});
const getFilms = async (page: number) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const url =
      props.carouselType === "all"
        ? `http://localhost:3000/?page=${page}`
        : `http://localhost:3000/upcoming?page=${page}`;
    const response = await axios.get(url, {
      headers,
    });
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
      !films.value.find((film) => res.rows.some((v) => v.id === film.id))
    ) {
      res.rows.forEach((film) => films.value.push(film));
    }
    filmsToShow.value = films.value.slice((page.value - 1) * 4, page.value * 4);
  }
};
</script>

<template>
  <section v-if="films.value.length" class="current-films__container">
    <BaseSubheader
      :subtitle="carouselType === 'all' ? 'Фильмы' : 'Анонсы'"
      :page="page"
      :is-last-page="isLastPage"
      :all-data-received="allFilmsReceived"
      @next-page="changePage('inc')"
      @prev-page="changePage('dec')"
    ></BaseSubheader>
    <div class="film-carousel">
      <FilmCarouselItem
        v-for="film in filmsToShow.value"
        :key="JSON.stringify(film)"
        :url="film.posterUrl"
        :name="film.name"
        :genres="film.genres"
        :id="(film.id as number)"
      >
      </FilmCarouselItem>
    </div>
  </section>
</template>

<style lang="scss" scoped>
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
