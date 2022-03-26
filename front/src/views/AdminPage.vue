<script setup lang="ts">
import axios from "axios";
import { reactive, onBeforeMount } from "vue";
import { setFile } from "../utils/fileUpload";
import { HTMLInputElement } from "../../../interfaces/events";
import { Film, Genre } from "../../../interfaces/models";

let film: Film = reactive({
  name: "",
  ageRestriction: "",
  posterUrl: "",
  startDate: "",
  genres: [],
  endDate: "",
});
let genres: { value: Genre[] } = reactive({ value: [] })

onBeforeMount(async () => {
  genres.value = await getGenres();
});

async function createFilm() {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  const formData = new FormData();
  formData.append("name", film.name);
  formData.append("ageRestriction", film.ageRestriction);
  formData.append("posterUrl", film.posterUrl);
  formData.append("startDate", film.startDate);
  formData.append("endDate", film.endDate);
  formData.append("genres", JSON.stringify(film.genres));
  try {
    const res = await axios.post("http://localhost:3000/admin/film", formData, {
      headers,
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  }
}

async function getGenres(): Promise<Genre[] | []> {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get("http://localhost:3000/admin/genres", {
      headers,
    });
    console.log(response, "after getGenres call");
    return response?.data ? reactive(response.data.genres) : reactive([]);
  } catch (e) {
    console.log(e);
    return [];
  }
}
</script>

<template>
  <div class="flex flex-col justify-center items-center max-w-sm">
    <div class="flex py-5">
      <label for="name" class="pr-4">Название фильма</label
      ><input type="text" id="name" v-model="film.name" />
    </div>
    <div class="flex py-5">
      <label for="ageRestriction" class="pr-4">Возрастное ограничение</label
      ><input type="text" id="ageRestriction" v-model="film.ageRestriction" />
    </div>
    <div class="flex py-5">
      <label for="posterUrl" class="pr-4">Постер фильма</label
      ><input
        type="file"
        id="posterUrl"
        @change="setFile($event as HTMLInputElement, film)"
      />
    </div>
    <div class="flex py-5">
      <label for="startDate" class="pr-4">Дата начала проката</label
      ><input
        type="date"
        min="2022-01-01"
        max="2050-12-31"
        id="startDate"
        v-model="film.startDate"
      />
    </div>
    <div class="flex py-5">
      <label for="endDate" class="pr-4">Дата окончания проката</label
      ><input
        type="date"
        min="2022-01-01"
        max="2050-12-31"
        id="endDate"
        v-model="film.endDate"
      />
    </div>
    <select multiple v-model="film.genres">
      <option v-for="genre in genres.value" :key="genre.name" :value="genre">
        {{ genre.name }}
      </option>
    </select>
    <button @click="createFilm">SAVE FILM</button>
  </div>
</template>
