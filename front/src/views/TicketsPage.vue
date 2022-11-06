<script setup lang="ts">
import { axiosInstance as axios } from "../utils/axios";
import ProfileComponent from "../components/ProfileComponent.vue";
import OrderInfoComponent from "../components/OrderInfoComponent.vue";
</script>

<template>
    <div class="tickets-page__wrapper">
        <ProfileComponent />
        <OrderInfoComponent />
    </div>
</template>

<style lang="scss" scoped>
.tickets-page__wrapper {
    width: 100%;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
}
</style>