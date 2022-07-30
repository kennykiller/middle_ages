<template>Hello</template>

<script setup lang="ts">
import { reactive, onBeforeMount } from "vue";
import { Film } from "@/interfaces/models";
import axios from "axios";

const films: { value: Film[] | [] } = reactive({ value: [] });
onBeforeMount(async () => {
  films.value = await getFilms();
});
const getFilms = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get("http://localhost:3000/films", {
      headers,
    });
    console.log(response);
    return response?.data ? response.data.films : [];
  } catch (e) {
    console.log(e);
  }
};
</script>
