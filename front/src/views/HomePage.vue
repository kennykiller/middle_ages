<script setup lang="ts">
import FilmCarousel from "@/components/carousel/FilmCarousel.vue";
import DiscountCarousel from "@/components/carousel/DiscountCarousel.vue";
</script>

<template>
  <div class="homepage__container">
    <main class="homepage-content__container">
      <FilmCarousel carousel-type="all" />
      <DiscountCarousel />
      <FilmCarousel carousel-type="upcoming" />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.homepage__container {
  width: 100%;
  display: grid;
  padding: 1rem;
  grid-template-columns: 1fr;
  .homepage-content__container {
    display: flex;
    flex-direction: column;
    row-gap: 1.5rem;
    &::v-deep .badge__wrapper {
      width: max-content;
    }
  }
}
</style>
