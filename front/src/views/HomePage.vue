<script setup lang="ts">
import NavigationComponent from "@/components/NavigationComponent.vue";
import { reactive, onBeforeMount } from 'vue';
import CarouselItem from "@/components/carousel/CarouselItem.vue";
import { Film } from "../../../interfaces/models"
import axios from "axios";

const films: { value: Film[] | [] } = reactive({ value: [] })
onBeforeMount(async () => {
  films.value = await getFilms();
});
const getFilms = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get("http://localhost:3000/", { headers });
    console.log(response);
    return response?.data ? response.data.films : [];
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="homepage__container">
    <NavigationComponent
    ></NavigationComponent>
    <main class="homepage-content__container">
      <section class="home-carousel current-films__container" v-if="films.value?.length">
        <CarouselItem
          v-for="film in films.value"
          :key="JSON.stringify(film)"
          :url="film.posterUrl"
          :name="film.name"
          :genres="film.genres"
        >
        </CarouselItem>
      </section>
      <section class="home-carousel discounts__container">
      </section>
      <section class="home-carousel future-films__container">
      </section>
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
    }
  }
}
</style>