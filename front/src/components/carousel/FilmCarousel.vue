<script setup lang="ts">
import FilmCarouselItem from "./FilmCarouselItem.vue";
import { reactive, onBeforeMount, watch, ref, Ref, computed } from "vue";
import { Film } from "../../../../interfaces/models";
import axios from "axios";

type mode = "inc" | "dec";
interface FilmsFromDB {
  rows: Film[];
  count: number;
}

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
  }
});
const getFilms = async (page: number) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(`http://localhost:3000/?page=${page}`, {
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
  console.log(page.value);
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
  <section class="current-films__container">
    <div
      :class="{
        'arrows__container--end': page === 1 && !isLastPage,
        'arrows__container--start': page > 1 && isLastPage,
      }"
      class="arrows__container"
    >
      <div v-if="page > 1" @click="changePage('dec')" class="arrow arrow--back">
        <img src="@/static/arrow.png" alt="" />
      </div>
      <div
        v-if="!allFilmsReceived || !isLastPage"
        @click="changePage('inc')"
        class="arrow arrow--forward"
      >
        <img src="@/static/arrow.png" alt="" />
      </div>
    </div>
    <div class="film-carousel">
      <FilmCarouselItem
        v-for="film in filmsToShow.value"
        :key="JSON.stringify(film)"
        :url="film.posterUrl"
        :name="film.name"
        :genres="film.genres"
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
  .arrows__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    padding: 0.5rem;
    margin-bottom: 1.5rem;
    &--end {
      justify-content: flex-end;
    }
    &--start {
      justify-content: flex-start;
    }
    .arrow {
      cursor: pointer;
      &:hover img {
        transform: scale(1.5);
      }
      &--forward {
        transform: rotate(180deg);
        &:hover img {
          transform: scale(1.5);
        }
      }
    }
    .arrow,
    .arrow img {
      width: 1.5rem;
      transition: transform 0.4s ease;
    }
  }
  .film-carousel {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
