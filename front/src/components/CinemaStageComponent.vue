<script setup lang="ts">
import { AxiosResponse } from "axios";
import { computed, reactive, Ref, ref } from "vue";
import { axiosInstance as axios } from "../utils/axios";
import { SessionSeatsResponse } from "@/interfaces/responses";
import { ExpandedSeat } from '@/interfaces/models';
import BaseBadge from './UI/BaseBadge.vue';
import { authModule } from "@/store/auth/auth-actions";
import { useRouter } from "vue-router";

const isLoggedIn = authModule.isAuthenticated;

interface Props {
  sessionId: number;
}
interface Seat {
  id: number;
  number: number;
  sessionId: number;
  status: statuses;
  isChosen: boolean;
}

enum statuses {
  'booked' = 1,
  'sold' = 2,
  'free' = 3
}

const router = useRouter();
const props = defineProps<Props>();
//get seats

const seats: Seat[] = reactive([]);
const chosenSeats: Seat[] = reactive([]);
const price: Ref<number> = ref(0);
const getSeats = async (sessionId: number) => {
  try {
    const response: AxiosResponse<SessionSeatsResponse> = await axios.get(`sessions/${sessionId}`);
    price.value = response.data.session.price;
    response.data.seats.forEach((el: ExpandedSeat) => seats.push({
      id: el.id,
      number: el.number,
      sessionId,
      status: el?.order?.status?.id || 3,
      isChosen: false,
    }))
    const storedChosenSeats = localStorage.getItem('chosenSeats');
    if (storedChosenSeats) {
      const parsedChosenSeats: Seat[] = JSON.parse(storedChosenSeats);
      if (parsedChosenSeats[0].sessionId === sessionId) {
        parsedChosenSeats.forEach(el => {
          chosenSeats.push(el);
          const idx = seats.findIndex(s => s.id === el.id);
          if (idx > -1) {
            seats[idx].isChosen = true;
          }
        });
      }
    }
    
  } catch (e) {
    console.log(e);
  }
};
getSeats(props.sessionId);
const rows = [...Array(11).keys()].slice(1);
const toggleBooking = (idx: number, status?: statuses) => {
  seats[idx].isChosen = seats[idx].status === 3 ? !seats[idx].isChosen : false;
  if (seats[idx].isChosen) {
    chosenSeats.push(seats[idx]);
  } else {
    const idxToRemove = chosenSeats.findIndex(
      (seat) => seat.id === seats[idx].id
    );
    if (idxToRemove > -1) {
      chosenSeats.splice(idxToRemove, 1);
    }
  }
};
const chosenSeatsSummary = computed(() => {
  return chosenSeats.map((el, idx) => {
    if (!idx) return `Выбранные места: ${el.number} место - ${Math.ceil(el.number / 10)} ряд`;
    return `${el.number} место - ${Math.ceil(el.number / 10)} ряд`}).join(', ');
})
const chosenSeatsPrice = computed(() => {
  return 'Общая сумма билетов: ' + chosenSeats.length * price.value + ' Руб';
})
const createOrder = async () => {
  if (localStorage.getItem('chosenSeats')) {
    localStorage.removeItem('chosenSeats');
  }
  const seatsIds = chosenSeats.map(el => el.id)
  const data = {
    userId: authModule.userId,
    seats: seatsIds,
    discountId: null,
    sessionId: props.sessionId,
  }
  try {
    const response = await axios.post('orders/new-order', data);
    router.push('/tickets');
  } catch (e) {
    throw new Error('Ошибка в создании заказа')
  }
}

const loginHandler = async () => {
  localStorage.setItem("chosenSeats", JSON.stringify(chosenSeats));
  console.log('before routing', localStorage.getItem('chosenSeats'));
  
  router.push('/auth');
}
</script>

<template>
  <div class="stage" @click.stop>
    <BaseBadge class="stage__screen" text="Экран" />
    <div class="stage__scheme scheme">
      <ul class="scheme__rows">
        <li class="scheme__row" v-for="row of rows" :key="row">
          <span>{{ row }}</span>
        </li>
      </ul>
      <ul v-if="seats.length" class="stage__list">
        <li
          class="stage__list-item seat"
          v-for="(seat, idx) of seats"
          :key="seat.id"
        >
          <img
            class="seat__image seat__image--busy"
            v-if="seat.status === 2"
            src="@/assets/images/busy-seat.png"
            alt="busy"
          />
          <img
            class="seat__image seat__image--free"
            v-if="seat.status === 3 && !seat.isChosen"
            src="@/assets/images/free-seat.png"
            @click="toggleBooking(idx)"
            alt="free"
          />
          <img
            class="seat__image seat__image--booked"
            :class="{'seat__image--chosen': seat.isChosen }"
            v-if="seat.status === 1 || seat.isChosen"
            @click="toggleBooking(idx, seat.status)"
            src="@/assets/images/booked-seat.png"
            alt="booked"
          />
        </li>
      </ul>
    </div>
    <div class="stage__info info">
      <BaseBadge class="info--warning" v-if="!chosenSeats.length" text="Выберите свободные места (указаны зеленым)" />
      <BaseBadge class="info--summary" v-else :text="chosenSeatsSummary" />
      <div v-if="chosenSeats.length" class="info--order">
        <BaseBadge :text="chosenSeatsPrice" />
        <BaseBadge v-if="!isLoggedIn" text="Войти и оформить заказ" @click="loginHandler" />
        <BaseBadge v-else text="Отправить заказ в корзину" @click.native="createOrder"></BaseBadge>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.stage {
  width: 640px;
  position: absolute;
  padding: 20px;
  z-index: 2;
  top: 50%;
  left: 50%;
  background: white;
  transform: translate(-50%, -50%);
  box-shadow: 0 4px 7px #88b8fe;
  &__screen {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    margin: 0 auto;
    box-shadow: 0 4px 7px #88b8fe;
  }
  &__scheme {
    display: flex;
    align-items: center;
  }
  &__list {
    display: grid;
    width: 90%;
    margin: 15px auto 0;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(10, 1fr);
    align-items: center;
    justify-items: center;
    gap: 2px;
    &-item {
      height: 24px;
      img {
        height: 24px;
      }
    }
    &-item:hover .seat__image--free {
      transform: scale(1.2);
    }
  }
  &__info {
    padding: 0.5rem 0;
  }
  .info--warning {
    &::v-deep button {
      width: 100%;
      span {
        text-align: center;
      }
    } 
  }

  .info {
    margin-bottom: 10px;
    &--summary {
      &:first-of-type {
        margin-bottom: 10px;
      }
      &::v-deep button {
        width: 100%;
        span {
          font-size: 1.1rem;
          text-align: left;
        }
      }
    }
    &--order {
      display: flex;
      align-items: center;
      justify-content: space-between;
      &::v-deep button {
        width: 100%;
        span {
          font-size: 1.1rem;
          text-align: left;
        }
      }
    }
  }
}
.scheme__rows {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin: 15px 0 0;
  & .scheme__row {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.seat__image--free,
.seat__image--booked {
  transition: transform 0.4s ease;
}

.seat__image--free,
.seat__image--chosen {
  cursor: pointer;
}
.seat__image--chosen {
  padding: 2px;
  border-radius: 50%;
  border: 1px solid black;
}
</style>
