<script lang="ts" setup>
import { axiosInstance as axios } from "../utils/axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const userData = reactive({
  email: "",
  password: "",
  passwordConfirmation: "",
  phone: "",
  name: "",
});

const router = useRouter();
const error = ref("");
const success = ref(false);

const signupHandler = async () => {
  try {
    const res = await axios.post("auth/signup", userData);
    if (!res.data?.accessToken && !res.data?.refreshToken && res.data.message) {
      const message:string[] = [res.data.message as string | string[]].flat();

      [error.value] = message[0] === 'phone must be a valid phone number' ? ['Номер телефона должен начинаться с 7'] : message;
      
      setTimeout(() => (error.value = ""), 2500);
    } else if (res.status !== 201) {
      error.value =
        "Регистрация не доступна, попробуйте немного позднее, мы работаем над этим.";
      setTimeout(() => (error.value = ""), 2500);
    } else {
      success.value = true;
      setTimeout(() => router.push({ name: "auth" }), 2000);
    }
  } catch (e)  {
    console.log(e, 'error');
  }
  
};
</script>

<template>
  <div>
    <div v-if="error" class="alert">
      <div class="alert__title">Ошибка регистрации</div>
      <div class="alert__description">
        {{ error }}
      </div>
    </div>
    <div v-if="success" class="success">
      <div class="success__title">Регистрация успешна</div>
      <div class="success__description">
        Сейчас произойдет переход на страницу авторизации...
      </div>
    </div>
    <section class="auth">
      <h1>Страница регистрации</h1>
      <form @submit.prevent="signupHandler" class="auth__form form">
        <div class="form__item">
          <input type="email" required v-model.trim="userData.email" />
          <label>Email</label>
        </div>
        <div class="form__item">
          <input type="password" required v-model.trim="userData.password" />
          <label>Пароль</label>
        </div>
        <div class="form__item">
          <input
            type="password"
            required
            v-model.trim="userData.passwordConfirmation"
          />
          <label>Повторите пароль</label>
        </div>
        <div class="form__item">
          <input type="text" required v-model.trim="userData.name" />
          <label>Ваше имя</label>
        </div>
        <div class="form__item">
          <input type="phone" required v-model.trim="userData.phone" />
          <label>Введите номер телефона</label>
        </div>
        <div class="form__submit-button">
          <button>Зарегистрироваться</button>
        </div>
      </form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
</style>
