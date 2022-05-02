<script setup lang="ts">
import DiscountCarouselItem from "./DiscountCarouselItem.vue";
import { reactive, onBeforeMount, ref, Ref, computed } from "vue";
import { Discount } from "../../../../interfaces/models";
import axios from "axios";
import DiscountCarouselItem1 from "./DiscountCarouselItem.vue";

type mode = "inc" | "dec";
interface DiscountsFromDB {
  rows: Discount[];
  count: number;
}

const discounts: { value: Discount[] } = reactive({ value: [] });
const discountsToShow: { value: Discount[] } = reactive({ value: [] });
let totalDiscountsAmt: Ref<number> = ref(0);
let page = ref(1);

let isLastPage = computed(() => {
  console.log(page.value * 4 >= totalDiscountsAmt.value, "is last page");

  return page.value * 4 >= totalDiscountsAmt.value;
});
let allDiscountsReceived = computed(() => {
  return totalDiscountsAmt.value === discounts.value.length;
});

onBeforeMount(async () => {
  const res: DiscountsFromDB = await getDiscounts(page.value);
  console.log(res);
  if (res.count) {
    ({ rows: discounts.value, count: totalDiscountsAmt.value } = res);
  }
  if (discounts.value.length > 4) {
    discountsToShow.value = discounts.value.slice(0, 4);
  } else {
    discountsToShow.value = discounts.value.slice(0);
  }
  console.log(totalDiscountsAmt.value);
  console.log(discounts.value);

  console.log(discountsToShow.value);
});
const getDiscounts = async (page: number) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  try {
    const response = await axios.get(
      `http://localhost:3000/discounts?page=${page}`,
      {
        headers,
      }
    );
    if (response?.data?.count) {
      return response.data;
    }
    return [];
  } catch (e) {
    console.log(e);
  }
};

function changePage(mode: mode) {
  mode === "inc" ? page.value++ : page.value--;
  console.log(page.value);
  carouselControl();
}

const carouselControl = async () => {
  if (allDiscountsReceived.value) {
    discountsToShow.value = discounts.value.slice(
      (page.value - 1) * 4,
      page.value * 4
    );
  } else if (page.value === 1) {
    discountsToShow.value = discounts.value.slice(0, 4);
  } else {
    const res: DiscountsFromDB = await getDiscounts(page.value);
    if (
      res.count &&
      !discounts.value.find((film) => res.rows.some((v) => v.id === film.id))
    ) {
      res.rows.forEach((film) => discounts.value.push(film));
    }
    discountsToShow.value = discounts.value.slice(
      (page.value - 1) * 4,
      page.value * 4
    );
  }
};
</script>

<template>
  <section class="current-discounts__container">
    <div
      :class="{
        'arrows__container--end': page === 1 && !isLastPage,
        'arrows__container--start': page > 1 && isLastPage,
      }"
      class="arrows__container"
    >
      <div v-if="page > 1" @click="changePage('dec')" class="arrow arrow--back">
        <img src="@/static/arrow.png" alt="" />
      </div>
      <div
        v-if="!allDiscountsReceived || !isLastPage"
        @click="changePage('inc')"
        class="arrow arrow--forward"
      >
        <img src="@/static/arrow.png" alt="" />
      </div>
    </div>
    <div class="discount-carousel">
      <DiscountCarouselItem
        v-for="discount in discountsToShow.value"
        :key="JSON.stringify(discount)"
        :url="discount.posterUrl"
        :name="discount.name"
        :description="discount.description"
        :discount-percentage="String(discount.discountPercentage)"
      >
      </DiscountCarouselItem>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.current-discounts__container {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  .arrows__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;
    padding: 0.5rem;
    margin-bottom: 1.5rem;
    &--end {
      justify-content: flex-end;
    }
    &--start {
      justify-content: flex-start;
    }
    .arrow {
      cursor: pointer;
      &:hover img {
        transform: scale(1.5);
      }
      &--forward {
        transform: rotate(180deg);
        &:hover img {
          transform: scale(1.5);
        }
      }
    }
    .arrow,
    .arrow img {
      width: 1.5rem;
      transition: transform 0.4s ease;
    }
  }
  .discount-carousel {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    div {
      transition: opacity 0.6s ease;
    }
    &:hover div {
      opacity: 0.5;
    }
    div:hover {
      opacity: 1;
    }
  }
}
</style>
