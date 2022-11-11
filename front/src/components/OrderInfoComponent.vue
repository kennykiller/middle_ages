<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { axiosInstance as axios } from '../utils/axios';
import { getUrl } from "@/utils/createUrl";
import { authModule } from '../store/auth/auth-actions';
import { AxiosResponse } from 'axios';
import { UnpaidOrderResponse } from '@/interfaces/responses';
import BaseBadge from './UI/BaseBadge.vue';

const order: Ref<UnpaidOrderResponse> = ref({
    id: 0,
    created_at: '',
    updated_at: '',
    seats: []
})

const minutesLeft = ref(0);
const secondsLeft = ref(0);
const isTimerExpired = ref(false);

const getOrder = async () => {
    try {
        const response: AxiosResponse = await axios.get(`orders/${authModule.userId}`);
        if (response.status === 200) {
            order.value = response.data;
        }
    } catch (e) {
        console.log(e);
    }
};

const cancelOrder = async (id: number) => {
    try {
        await axios.delete(`orders/${id}`)
    } catch (e) {
        console.log(e, 'removal error');
    }
};

const checkoutOrder = async () => {

};

const setCountdown = () => {
    const dateOfCreation = new Date(order.value.created_at).getTime();
    const dateOfFinish = new Date(dateOfCreation + 1 * 60 * 1000).getTime();
    const second = 1000;
    const minute = second * 60;
    const countdownId = setInterval(() => {
        const distance = dateOfFinish - Date.now();
        minutesLeft.value = Math.floor(distance / minute);
        secondsLeft.value = Math.floor((distance % minute) / second);

        if (distance < 0) {
            clearInterval(countdownId);
            isTimerExpired.value = true;
            cancelOrder(order.value.id);
        } 
    }, 1000)
}

const urlToSend = computed(() => order.value.seats[0]?.session?.film?.posterUrl ? getUrl('films', order.value.seats[0].session.film.posterUrl) : '');

onMounted(async () => {
    await getOrder();
    if (order.value.id) {
        setCountdown();
    }
});


</script>


<template>
    <div class="order">
        <div class="order-info__wrapper">
            <div v-if="order.id && !isTimerExpired" class="order-countdown__wrapper">
                <h2 class="order__title">Время на оплату заказа: {{ minutesLeft + ' минут ' }} {{ secondsLeft + ' секунд' }}</h2>
            </div>
            <div v-else-if="isTimerExpired && order.id">
                <h2 class="order__title">Время на оплату истекло, пожалуйста оформите заказ заново.</h2>
            </div>
            <div v-else class="order__notfound">
                <h2 class="order__title">Нет новых заказов.</h2>
            </div>
        </div>
        <BaseBadge class="order-content__subheader" v-if="order.id && !isTimerExpired" text="Состав заказа"></BaseBadge>
        <div class="order-content__wrapper">
            <div v-if="order.id && !isTimerExpired" class="order-content-body__wrapper content">
                <div class="content-film__wrapper">
                    <img v-if="urlToSend" :src="urlToSend" alt="booked film">
                    <time>Начало сеанса: {{ order.seats[0].session.filmStart }}</time>
                </div>
                <h3>Выбранные места</h3>
                <div class="content-seats__wrapper seats">
                    <div class="seats__subheader">
                        <span>Ряд</span>
                        <span>Место</span>
                    </div>
                    <div v-for="seat of order.seats" :key="seat.id" class="seats__grid">
                        <span>{{ Math.ceil(seat.number / 10) }}</span>
                        <span>{{ seat.number }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>

<style lang="scss" scoped>
.order {
    max-width: 70%;
    width: 100%;
    height: 100%;
    &-info__wrapper, &-content__wrapper {
        width: 100%;
        border-radius: 4px;
        box-shadow: 0 10px 15px -3px rgba(13, 49, 150, 0.8),
            0 4px 6px -4px rgba(0, 0, 0, 0.8);
    }
    &-countdown__wrapper, &-content-body__wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;
        background: #acb6e5;
        background: -webkit-linear-gradient(to right, #acb6e5, #86fde8);
        background: linear-gradient(to right, #acb6e5, #86fde8);
    }

    &-countdown__wrapper {
        margin-bottom: 1.5rem;
    }

    &-content__subheader {
        width: auto;
    }

    &__title {
        text-align: center;
    }

}
</style>