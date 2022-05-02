<script setup lang="ts">
import NavigationComponent from "@/components/NavigationComponent.vue";
import FilmCarousel from "@/components/carousel/FilmCarousel.vue";
</script>

<template>
  <div class="homepage__container">
    <NavigationComponent></NavigationComponent>
    <main class="homepage-content__container">
      <FilmCarousel />
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
  }
}
</style>
