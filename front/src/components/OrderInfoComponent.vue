<script setup lang="ts">
import { computed, onMounted, Ref, ref } from 'vue';
import { axiosInstance as axios } from '../utils/axios';
import { getUrl } from "@/utils/createUrl";
import { authModule } from '../store/auth/auth-actions';
import { AxiosResponse } from 'axios';
import { UnpaidOrderResponse } from '@/interfaces/responses';
import BaseBadge from './UI/BaseBadge.vue';
import { monthNumber } from '../interfaces/types';

const order: Ref<UnpaidOrderResponse> = ref({
    id: 0,
    created_at: '',
    updated_at: '',
    seats: []
})

const months = {
  "0": "января",
  "1": "февраля",
  "2": "марта",
  "3": "апреля",
  "4": "мая",
  "5": "июня",
  "6": "июля",
  "7": "августа",
  "8": "сентября",
  "9": "октября",
  "10": "ноября",
  "11": "декабря",
};

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
    const dateOfFinish = new Date(dateOfCreation + 25 * 60 * 1000).getTime();
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
const countdownText = computed(() => `Время на оплату заказа: ${minutesLeft.value} минут ${secondsLeft.value} секунд`)
const sessionStartDate = computed(() => {
    if (order.value.seats[0]?.session?.filmStart) {
        const d = new Date(order.value.seats[0].session.filmStart);
        const y = d.getFullYear();
        const m = d.getMonth();
        const date = d.getDate();
        const h = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
        const min = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
        const sec = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();
        
        return `${date} ${months[String(m) as monthNumber]} ${y} в ${h}:${min}:${sec}`;
    }   return 'не установлено';
})

onMounted(async () => {
    await getOrder();
    if (order.value.id) {
        setCountdown();
    }
});


</script>


<template>
    <div class="order">
        <BaseBadge class="order-countdown" v-if="order.id && !isTimerExpired" :text="countdownText" />
        <BaseBadge class="order-countdown" v-else-if="isTimerExpired && order.id" text="Время на оплату истекло, пожалуйста оформите заказ заново." />
        <BaseBadge class="order-countdown" v-else text="Нет новых заказов." />
        <BaseBadge v-if="order.id && !isTimerExpired" text="Состав заказа" />
        <div class="order-content__wrapper">
            <div v-if="order.id && !isTimerExpired" class="order-content-body__wrapper content">
                <img v-if="urlToSend" :src="urlToSend" alt="booked film">
                <span>Начало сеанса: {{ sessionStartDate }}</span>
                <div class="content-film__wrapper">
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
    </div>  
</template>

<style lang="scss" scoped>
.order {
    max-width: 70%;
    width: 100%;
    height: 100%;
    &::v-deep .badge__wrapper {
        max-width: max-content;
    }
    & > div {
        margin-bottom: 1rem;
    }
    &-content__wrapper {
        width: 100%;
    }
    &-content-body__wrapper {
        box-shadow: 0 4px 15px #88b8fe;
        border-radius: 4px;
        padding: 0.5rem;
        border: 1px solid #ced4da;
        display: flex;
    }

    &__title {
        text-align: center;
    }

    .content {
        img {
            height: 200px;
        }
    }
}
</style>