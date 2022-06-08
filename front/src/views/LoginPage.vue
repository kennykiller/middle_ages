<script setup lang="ts">
import axios from "axios";
import { reactive } from "vue";

const loginData = reactive({
  email: "",
  password: "",
});

const loginHandler = async () => {
  const res = await axios.post("http://localhost:3000/auth/login", loginData);
  console.log(res);
};
</script>

<template>
  <div>
    <div class="alert">
      <div class="alert__title">Ошибка авторизации</div>
      <div class="alert__description">
        Проверьте введенные данные или зарегистрируйтесь.
      </div>
    </div>
    <section class="auth">
      <h1>Войдите в аккаунт</h1>
      <form @submit.prevent="loginHandler" class="form">
        <div class="form__item">
          <input type="email" v-model.trim="loginData.email" />
          <label>Email</label>
        </div>
        <div class="form__item">
          <input type="password" v-model.trim="loginData.password" />
          <label>Пароль</label>
        </div>
        <div class="form__submit">
          <button>Войти</button>
        </div>
      </form>
      <div class="auth__footer">
        <p>
          Не можете войти?
          <router-link to="#">Сбросить пароль</router-link> <br />
          Еще не зарегистрированы?
          <router-link to="/signup">Давайте сделаем это!</router-link>
        </p>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
</style>
