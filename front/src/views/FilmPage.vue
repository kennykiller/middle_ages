<template>
<h1>inside detail page</h1>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import { Film } from "../../../interfaces/models"
import axios from "axios";

const route = useRoute();
let film: Film | undefined;
onBeforeMount(async () => {
  film = await getFilms();
});

const getFilms = async () => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(`http://localhost:3000/films/${route.params.id}`, { headers });
    console.log(response);
    if (response?.data) return response.data.film as Film;
    throw Error('no such film received');
  } catch (e) {
    console.log(e);
  }
};
</script>