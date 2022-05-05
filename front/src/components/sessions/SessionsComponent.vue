<script setup lang="ts">
import SessionItem from './SessionItem.vue';

</script>

<template>
<div class="sessions__wrapper">
    <h2>Выберите удобное время</h2>
    <SessionItem time="13.00" price="500" placesLeft="30"></SessionItem>
</div>
</template>

<style lang="scss">
.sessions__wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
</style>