<script setup lang="ts">
import { reactive, ref, computed } from "vue";
import { authModule } from "@/store/auth/auth-actions";
import { useRouter } from "vue-router";

const loginData = reactive({
  email: "",
  password: "",
});

const router = useRouter();

const errorMessage = ref("");

const loginHandler = async () => {
  const res = await authModule.login(loginData);
  console.log(res, 'res');
  
  if (typeof res === "string") {
    errorMessage.value = res;
    setTimeout(() => (errorMessage.value = ""), 4000);
  } else if (res) {
    router.push({ path: "/" });
  }
  console.log(res);
};
</script>

<template>
  <div>
    <div v-if="errorMessage" class="alert">
      <div class="alert__title">Ошибка авторизации</div>
      <div class="alert__description">
        {{ errorMessage }}
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
          <router-link to="/reset">Сбросить пароль</router-link> <br />
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
