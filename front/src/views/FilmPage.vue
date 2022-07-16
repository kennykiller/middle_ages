<script setup lang="ts">
import { onBeforeMount, reactive, Ref, ref } from "vue";
import { useRoute } from "vue-router";
import { Film, Genre } from "../../../interfaces/models";
import { getImageUrl } from "@/utils/getImage";
import axios, { AxiosResponse } from "axios";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import CalendarComponent from "@/components/CalendarComponent.vue";
import SessionItem from "@/components/sessions/SessionItem.vue";

interface SessionResponse {
  filmId: number;
  filmStart: string;
  id: number;
  price: number;
  seatsAvailable: number;
}
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
let sessionsSchedule: SessionResponse[] = reactive([]);
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
    throw new Error("no such film received");
  } catch (e) {
    console.log(e);
  }
};

const getSessions = async (date: Date) => {
  try {
    const response: AxiosResponse<{ sessions: SessionResponse[] }> =
      await axios.post(
        `http://localhost:3000/films/sessions/${route.params.id}`,
        { date }
      );

    if (response?.data?.sessions) {
      sessionsSchedule.length = 0;
      response.data.sessions = response.data.sessions.map((session) => {
        const start = new Date(String(session.filmStart));
        const h =
          start.getHours() < 10 ? `0${start.getHours()}` : start.getHours();
        const m =
          start.getMinutes() < 10
            ? `0${start.getMinutes()}`
            : start.getMinutes();
        const s =
          start.getSeconds() < 10
            ? `0${start.getSeconds()}`
            : start.getSeconds();
        const filmStart = `${h}:${m}:${s}`;
        return { ...session, filmStart };
      });
      response.data.sessions.forEach((s) => sessionsSchedule.push(s));
      console.log(sessionsSchedule);

      return;
    }
    throw new Error("На эту дату нет фильмов");
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <div class="item__wrapper film" v-if="film.value">
    <div class="film__base-info-wrapper">
      <div class="film__poster-wrapper">
        <img class="film-poster" :src="getImageUrl(url)" alt="" />
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
        v-if="film.value.startDate"
        @check-theaters="checkTheaters = $event"
        @choose-date="getSessions($event)"
        text="Выберите дату"
        :start-date="film.value.startDate"
        :end-date="film.value.endDate"
      ></CalendarComponent>
    </div>
    <div v-if="sessionsSchedule.length" class="film__sessions-wrapper">
      <SessionItem
        v-for="session of sessionsSchedule"
        :key="session.filmId"
        :time="session.filmStart"
        :price="String(session.price)"
        :places-left="String(session.seatsAvailable)"
      ></SessionItem>
    </div>
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
  &__genres-wrapper {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    div:not(:last-child) {
      margin-right: 1rem;
    }
  }
  &__sessions-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    &::v-deep .session__confirm {
      padding: 0.2rem 0;
    }
  }
}
</style>
