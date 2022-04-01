<script setup lang="ts">
import NavigationComponent from "@/components/NavigationComponent.vue";
import { reactive, onBeforeMount, ref, onMounted } from "vue";
import CarouselItem from "@/components/carousel/CarouselItem.vue";
import { Film } from "../../../interfaces/models";
import axios from "axios";

type destination = 'back' | 'forward';
const films: { value: Film[] | [] } = reactive({ value: [] });
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
//swiping
let sectionEl:HTMLElement;
onMounted(() => {
  sectionEl = document.querySelector('.home-carousel.current-films__container')!;
  console.log(sectionEl);
  console.log(sectionEl.offsetWidth, 'offset');
  console.log(sectionEl.clientWidth, 'client');
  console.log(sectionEl.scrollWidth, 'scroll');
})
const swipePosters = (dest:destination) => {
  const currentRight = parseFloat(sectionEl.style.right) || 0;
  if (dest === 'back') {
    sectionEl.style.right = currentRight - 400 + 'px';   
  } else {
    sectionEl.style.right = currentRight + 400 + 'px';
  }
}
</script>

<template>
  <div class="homepage__container">
    <NavigationComponent></NavigationComponent>
    <main class="homepage-content__container">
      <section
        class="home-carousel current-films__container"
      >
        <button @click="swipePosters('back')" class="arrow arrow--back">go back</button>
        <CarouselItem
          v-for="film in films.value"
          :key="JSON.stringify(film)"
          :url="film.posterUrl"
          :name="film.name"
          :genres="film.genres"
        >
        </CarouselItem>
        <button @click="swipePosters('forward')" class="arrow arrow--forward">go forward</button>
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
        position: absolute;
        top: -2rem;
      }
      .arrow--forward {
        right: 35rem;
      }
    }
  }
}
</style>
