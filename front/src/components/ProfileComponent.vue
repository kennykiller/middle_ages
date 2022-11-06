<script setup lang="ts">
import { axiosInstance as axios } from '../utils/axios';
import { authModule } from '../store/auth/auth-actions';
import { ExpandedUser } from '@/interfaces/models';
import { ref, Ref } from '@vue/reactivity';
import { AxiosResponse } from 'axios';
import { onMounted } from '@vue/runtime-core';

const user: Ref<ExpandedUser> = ref({
    email: '',
    id: 0,
    isAdmin: false,
    refreshToken: '',
    userStatus: null,
    name: '',
    phone: '',
    orders: null,
})
const getUser = async () => {
    try {
       const response: AxiosResponse<ExpandedUser>= await axios.get(`users/detailed/${authModule.userId}`);
       if (response.status === 200) {
        user.value = response.data;
       } 
       return {};
    } catch (e) {
        console.log(e);
        return {};
    }
}

onMounted(() => getUser());
</script>

<template>
    <div class="card">
        <div class="avatar__wrapper">
            <div class="avatar"></div>
        </div>
        <div class="main-info">
            <h1>{{ user.name }}</h1>
            <h2>{{ user.userStatus?.name }}</h2>
        </div>
        <div class="divider"></div>
        <div class="orders-info orders">
            <div class="orders-amount">
                <span class="orders-text">{{ user.orders?.length || 0 }}</span><br />
                <span class="orders-subtitle">Сделано заказов</span>
            </div>
            <div class="orders-discount">
                <span class="orders-text">{{ user.userStatus?.discountPercentage || 0 + '%' }}</span><br />
                <span class="orders-subtitle">Скидка за статус</span>
            </div>
        </div>
        <div class="divider"></div>
        <h2 class="contacts-subheader">Контакты</h2>
        <div class="contacts">
            <div class="contacts-phone">
                <span class="contacts-text">{{ user.phone }}</span><br />
                <span class="contacts-subtitle">Телефон</span>
            </div>
            <div class="contacts-email">
                <span class="contacts-text">{{ user.email }}</span><br />
                <span class="contacts-subtitle">Email</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.card {
  height: 100%;
  border-radius: 4px;
  box-shadow: 0 10px 15px -3px rgba(13, 49, 150, 0.8),
    0 4px 6px -4px rgba(0, 0, 0, 0.8);
  background-color: #fff;
  width: 320px;
  margin-right: 2rem;
  overflow: hidden;
  opacity: 1;
  filter: alpha(opacity=100);
  animation: card 2s forwards;
  animation-iteration-count: 1;
  animation-delay: 0s;
  transition-timing-function: ease-in-out;
}

@keyframes card {
  0% {
    opacity: 1;
    filter: alpha(opacity=100);
    height: 1px;
    border-left: 0px solid #FFF;
    background: #444a59;
  }
  60% {
    opacity: 1;
    filter: alpha(opacity=100);
    height: 1px;
    background: #444a59;
  }
  61% {
    opacity: 1;
    filter: alpha(opacity=100);
    height: 1px;
    background: #FFF;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    height: 380px;
  }
}

.avatar {
    &__wrapper {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 0.5rem 0;
        background: #acb6e5;
        background: -webkit-linear-gradient(to right, #acb6e5, #86fde8);
        background: linear-gradient(to right, #acb6e5, #86fde8);

        & div {
            width: 110px;
            height: 110px;
            background: url('https://joeschmoe.io/api/v1/random') no-repeat center center #FFF;
            border-radius: 100%;
            border: 5px solid rgba(255, 255, 255, 1);
            opacity: 0;
            filter: alpha(opacity=0);
            animation: avatar 1.5s forwards;
            animation-iteration-count: 1;
            animation-delay: 1s;
            transition-timing-function: ease-in-out;
        }
    }
}

@keyframes avatar {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
  }
  50% {
    opacity: 1;
    filter: alpha(opacity=100);
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
  }
}

.main-info {
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  flex-direction: column;
  width: 100%;
  height: 80px;
  background: #FFF;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

h1 {
  font-size: 1.7em;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: #0c3779;
  padding: .3rem 0;
  opacity: 0;
  filter: alpha(opacity=0);
  animation: heading1 1s forwards;
  animation-iteration-count: 1;
  animation-delay: 1.8s;
  transition-timing-function: ease-in-out;
}

@keyframes heading1 {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
  }
}

h2 {
  font-size: 1em;
  font-weight: 300;
  color: #999;
  opacity: 0;
  filter: alpha(opacity=0);
  animation: heading2 0.6s forwards;
  animation-iteration-count: 1;
  animation-delay: 2.2s;
  transition-timing-function: ease-in-out;
}

@keyframes heading2 {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
  }
}

.divider {
  width: 0px;
  height: 1px;
  background: #EAEAEA;
  opacity: 0;
  filter: alpha(opacity=0);
  animation: divider 1s forwards;
  animation-iteration-count: 1;
  animation-delay: 2.4s;
  transition-timing-function: ease-in-out;
}

@keyframes divider {
  0% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 0px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
  }
}

.contacts-subheader {
    padding: 1rem;
    text-align: center;
}

.orders-info, .contacts {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  opacity: 0;
  filter: alpha(opacity=0);
  animation: orders-info 0.6s forwards;
  animation-iteration-count: 1;
  animation-delay: 1s;
  transition-timing-function: ease-in-out;
}

@keyframes orders-info {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
  }
}

.orders-amount,
.contacts-phone,
.contacts-email,
.orders-discount {
  opacity: 0;
  filter: alpha(opacity=0);
  width: 140px;
  text-align: center;
  animation: orders-info 0.6s forwards;
}

.orders-amount, .contacts-phone {
  -webkit-animation-delay: 2.4s;
  animation-delay: 2.4s;
}

.orders-discount, .contacts-email {
  -webkit-animation-delay: 2.6s;
  animation-delay: 2.6s;
}

.orders-text,
.contacts-text,
.contacts-subtitle,
.orders-subtitle {
  font-family: 'Roboto', sans-serif;
}

.orders-text {
  font-weight: 700;
  font-size: 1.5em;
  color: #798191;
}

.contacts-text {
    font-weight: 400;
    font-size: 1em;
    color: #798191;
}

.orders-subtitle,
.contacts-subtitle {
  font-weight: 300;
  font-size: 0.8em;
  color: #999;
}
</style>