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

const films: { value: Film[] } = reactive({ value: [] }); //8
const filmsToShow: { value: Film[] } = reactive({ value: [] }); //4
let totalFilmsAmt: Ref<number> = ref(0); //22
let page = ref(0);
let isLastPage = computed(() => {
  return (page.value + 1) * 4 >= totalFilmsAmt.value;
});
let allFilmsReceived = computed(() => {
  return totalFilmsAmt.value === films.value.length;
});
onBeforeMount(async () => {
  const res: FilmsFromDB = await getFilms(page.value);
  if (res.count) {
    ({
      rows: films.value,
      rows: filmsToShow.value,
      count: totalFilmsAmt.value,
    } = res);
  }
  if (filmsToShow.value.length > 4)
    filmsToShow.value = filmsToShow.value.slice(0, 4);
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
watch(page, async (val: number, oldVal: number) => {
    console.log(page);
    
    if (val < oldVal && !allFilmsReceived.value) {
        filmsToShow.value = films.value.slice(val * 4, oldVal * 4)
    } else if (val > 0 && !allFilmsReceived.value) {
        filmsToShow.value = films.value.slice(-4);
        const res: FilmsFromDB = await getFilms(val);
        if (res.count) {
            res.rows.forEach((film) => films.value.push(film));
        }
    } else if (val > oldVal && allFilmsReceived.value) {
        filmsToShow.value = films.value.slice(val * 4);
    } else if (val < oldVal && allFilmsReceived.value) {
        filmsToShow.value = films.value.slice(val * 4, oldVal * 4)
    } 
//   if (!oldVal && !allFilmsReceived.value) {

//   }
//   if (allFilmsReceived.value || val < oldVal) {
//     filmsToShow.value = films.value.slice((val + 1) * 4, (val + 2) * 4);
//     return;
//   }
//   if (val > 0 && !allFilmsReceived.value) {
//     filmsToShow.value = films.value.slice(val * 4, (val + 1) * 4);
//     console.log(filmsToShow.value);

//     const res: FilmsFromDB = await getFilms(val);
//     if (res.count) {
//       res.rows.forEach((film) => films.value.push(film));
//     }
//   } else {
//     const res: FilmsFromDB = await getFilms(val);
//     if (res.count) {
//       res.rows.forEach((film) => films.value.push(film));
//       //   ({ rows: filmsToShow.value } = res);
//       filmsToShow.value = films.value.slice((val + 1) * 4, (val + 2) * 4);
//     }
//   }
});
function changePage(mode: mode) {
  mode === "inc" ? page.value++ : page.value--;
  console.log(page.value, "page value");
}
</script>

<template>
  <section class="current-films__container">
    <div
      :class="{
        'arrows__container--end': page === 0 && !isLastPage,
        'arrows__container--start': page > 0 && isLastPage,
      }"
      class="arrows__container"
    >
      <div v-if="page > 0" @click="changePage('dec')" class="arrow arrow--back">
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
