<script setup lang="ts">
import { onBeforeMount, reactive, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import { Film, Genre } from "../../../interfaces/models";
import axios from "axios";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import SessionsComponent from "@/components/sessions/SessionsComponent.vue";

type filmStart = "past" | "now" | "future";
const route = useRoute();
const film: { value: Film | undefined } = reactive({
  value: {
    id: 1000,
    name: "",
    basePrice: 500,
    description: "",
    startDate: "",
    endDate: "",
    filmDuration: "",
    posterUrl: "",
    ageRestriction: "",
    genres: [] as Genre[],
  },
});
let url: Ref<string> = ref("");
let checkTheaters: Ref<filmStart> = ref("past");
onBeforeMount(async () => {
  film.value = await getFilm();
  url.value = film.value?.posterUrl.match(/images(.)+/g)![0] || "";
});

const getFilm = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(
      `http://localhost:3000/films/${route.params.id}`,
      { headers }
    );
    console.log(response.data);

    if (response?.data) return response.data as Film;
    throw Error("no such film received");
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="item__wrapper film" v-if="film.value">
    <div class="film__base-info-wrapper">
      <div class="film__poster-wrapper">
        <img class="film-poster" :src="require(`@/${url}`)" alt="" />
      </div>
      <div class="film__text-wrapper">
        <h1>{{ film.value.name }}</h1>
        <h2>{{ film.value.description }}</h2>
        <h2>Возрастное ограничение: {{ film.value.ageRestriction }}</h2>
        <h2>Продолжительность фильма: {{ film.value.filmDuration }}</h2>
        <h3 v-if="checkTheaters !== 'past'">
          Фильм в прокате с {{ film.value.startDate }} до
          {{ film.value.endDate }}
        </h3>
        <div class="film__genres-wrapper">
          <BaseBadge
            v-for="genre in film.value.genres"
            :key="genre.id"
            :text="genre.name"
            popover
            popover-text="Найти похожие"
          />
        </div>
      </div>
    </div>
    <div class="film__schedule-wrapper">
      <CalendarComponent
        @check-theaters="checkTheaters = $event"
        text="Выберите дату"
        :start-date="film.value.startDate"
        :end-date="film.value.endDate"
      ></CalendarComponent>
    </div>
    <!-- <div class="film__sessions-wrapper">
      <SessionsComponent></SessionsComponent>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
.item__wrapper {
  width: 100%;
  padding: 0 1rem;
}
.film {
  &__base-info-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  &__poster-wrapper {
    padding-right: 5rem;
    img {
      border-radius: 4px;
      transition: transform 0.6s ease;
    }
    &:hover img {
      transform: scale(1.1);
      box-shadow: 0 0 0 4px rgba(#88b8fe, 0.5);
    }
  }
  &__schedule-wrapper {
    display: flex;
    justify-content: center;
  }
  &__text-wrapper {
  }
  &__genres-wrapper {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    div:not(:last-child) {
      margin-right: 1rem;
    }
  }
}
</style>
