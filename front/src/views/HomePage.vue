<script setup lang="ts">
import NavigationComponent from "@/components/NavigationComponent.vue";
import { reactive, onBeforeMount, watch, ref, Ref } from "vue";
import CarouselItem from "@/components/carousel/CarouselItem.vue";
import { Film } from "../../../interfaces/models";
import axios from "axios";
import { computed } from "@vue/reactivity";

type mode = "inc" | "dec";
interface FilmsFromDB {
  rows: Film[];
  count: number;
}

const films: { value: Film[] } = reactive({ value: [] });
const filmsToShow: { value: Film[] } = reactive({ value: [] });
let totalFilmsAmt: Ref<number> = ref(0);
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
watch(page, async (val: number) => {
  if (allFilmsReceived.value) {
    filmsToShow.value = films.value.slice(val * 4, (val + 1) * 4);
    return;
  }
  const res: FilmsFromDB = await getFilms(val);
  if (res.count) {
    res.rows.forEach((film) => films.value.push(film));
    ({ rows: filmsToShow.value } = res);
  }
});
function changePage(mode: mode) {
  mode === "inc" ? page.value++ : page.value--;
}
</script>

<template>
  <div class="homepage__container">
    <NavigationComponent></NavigationComponent>
    <main class="homepage-content__container">
      <div v-if="page > 0" @click="changePage('dec')" class="arrow arrow--back"><img src="@/static/arrow.png" alt="" /></div>
      <div v-if="!allFilmsReceived || !isLastPage" @click="changePage('inc')" class="arrow arrow--forward"><img src="@/static/arrow.png" alt="" /></div>
      <section class="home-carousel current-films__container">
        <CarouselItem
          v-for="film in filmsToShow.value"
          :key="JSON.stringify(film)"
          :url="film.posterUrl"
          :name="film.name"
          :genres="film.genres"
        >
        </CarouselItem>
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
      & div {
        transition: opacity .6s ease;
      }
      &:hover div {
        opacity: 0.5;
      }
      div:hover {
        opacity: 1;
      }
    }
  }
}
.arrow {
  position: absolute;
  top: 45%;
  left: 40%;
  width: 51px;
  & img {
    width: 51px;
  }
  &:hover {
    color: green;
  }
  &--forward {
    left: 60%;
    transform: rotate(180deg)
  }
}
.arrow--forward {
  right: 35rem;
}
</style>
