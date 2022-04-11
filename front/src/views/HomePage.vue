<script setup lang="ts">
import NavigationComponent from "@/components/NavigationComponent.vue";
import { reactive, onBeforeMount, watch, ref, Ref } from "vue";
import CarouselItem from "@/components/carousel/CarouselItem.vue";
import { Film } from "../../../interfaces/models";
import axios from "axios";

type mode = 'inc' | 'dec';

const films: { value: Film[] | [] } = reactive({ value: [] });
let page = ref(0);
let totalFilmsAmt = ref(0); // проверять наличие последующих фильмов (приходит общее количество фильмов, надо знать скок осталось, чтобы в зависимости от этого рендерить кнопку показа других фильмов)
onBeforeMount(async () => {
  ({ count: totalFilmsAmt.value, rows: films.value } = await getFilms(page.value));
});
const getFilms = async (page: number) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(`http://localhost:3000/?page=${page}`, { headers });
    return response?.data ? response.data.films : [];
  } catch (e) {
    console.log(e);
  }
};
watch(page,async (val:number) => {
    ({ rows: films.value } = await getFilms(val))
  });
function changePage(mode:mode) {
  mode === 'inc' ? page.value++ : page.value--;
}
</script>

<template>
  <div class="homepage__container">
    <NavigationComponent></NavigationComponent>
    <main class="homepage-content__container">
      <section
        class="home-carousel current-films__container"
      >
        <button v-if="page > 0" @click="changePage('dec')" class="arrow arrow--back">go back</button>
        <CarouselItem
          v-for="film in films.value"
          :key="JSON.stringify(film)"
          :url="film.posterUrl"
          :name="film.name"
          :genres="film.genres"
        >
        </CarouselItem>
        <button @click="changePage('inc')" class="arrow arrow--forward">go forward</button>
      </section>
      <section class="home-carousel discounts__container"></section>
      <section class="home-carousel future-films__container"></section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.homepage__container {
  width: 100%;
  display: grid;
  padding: 1rem;
  grid-template-columns: minmax(6rem, 10rem) 1fr;
  .homepage-content__container {
    display: flex;
    flex-direction: column;
    .home-carousel {
      display: flex;
      justify-content: space-between;
      position: relative;
      .arrow {
        text-decoration: none;
        position: absolute;
        top: -2rem;
        &:hover {
          color: green;
        }
      }
      .arrow--forward {
        right: 35rem;
      }
    }
  }
}
</style>
