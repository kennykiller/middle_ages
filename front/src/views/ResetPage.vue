<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import axios from "axios";
import { reactive, ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

let userId, token;

if (route.query) {
  console.log(route.query);

  userId = route.query.userId;
  token = route.query.token;
}

const userData = reactive({
  password: "",
  passwordConfirmation: "",
});

const emailForRecover = reactive({
  email: "",
});

const isLinkCreatePage = computed(() => route.name === "reset");
const error = ref("");
const success = ref(false);
const successText = computed(() =>
  isLinkCreatePage
    ? "Проверьте почтовый ящик и перейдите по полученной ссылке."
    : "Пароль успешно обновлен! Войдите в систему с новыми данными."
);
const buttonText = computed(() =>
  isLinkCreatePage ? "Сбросить пароль" : "Сохранить пароль"
);
const headerText = computed(() =>
  isLinkCreatePage ? "Сброс пароля" : "Обновление пароля"
);
const successHeader = computed(() =>
  isLinkCreatePage ? "Ссылка отправлена!" : "Пароль обновлен!"
);

const createLinkHandler = async () => {
  const res = await axios.post(
    "http://localhost:3000/auth/reset",
    emailForRecover
  );
  if (!res.data?.success && res.data?.data?.length) {
    error.value = res.data.data[0].msg;
    setTimeout(() => (error.value = ""), 2000);
  } else if (!res.data?.success) {
    error.value = "Попробуйте сбросить немного позднее, мы работаем над этим.";
    setTimeout(() => (error.value = ""), 2000);
  } else {
    success.value = true;
    setTimeout(() => router.push({ name: "auth" }), 3000);
  }
};

const passwordRefreshHandler = async () => {
  const res = await axios.post(
    "http://localhost:3000/auth/reset-password",
    userData
  );
  if (!res.data?.success && res.data?.data?.length) {
    error.value = res.data.data[0].msg;
    setTimeout(() => (error.value = ""), 2000);
  } else if (!res.data?.success) {
    error.value =
      "Пароль восстановить не удалось, попробуйте немного позднее, мы работаем над этим.";
    setTimeout(() => (error.value = ""), 2000);
  } else {
    success.value = true;
    setTimeout(() => router.push({ name: "auth" }), 3000);
  }
};
</script>

<template>
  <div>
    <div v-if="error" class="alert">
      <div class="alert__title">Произошла ошибка</div>
      <div class="alert__description">
        {{ error }}
      </div>
    </div>
    <div v-if="success" class="success">
      <div class="success__title">{{ successHeader }}</div>
      <div class="success__description">
        {{ successText }}
      </div>
    </div>
    <section class="auth">
      <h1>{{ headerText }}</h1>
      <form @submit.prevent="createLinkHandler" class="auth__form form">
        <div class="form__item" v-if="isLinkCreatePage">
          <input type="email" required v-model.trim="emailForRecover.email" />
          <label>Ваш Email</label>
        </div>
        <div class="form__item" v-if="!isLinkCreatePage">
          <input type="password" required v-model.trim="userData.password" />
          <label>Новый пароль</label>
        </div>
        <div class="form__item" v-if="!isLinkCreatePage">
          <input
            type="password"
            required
            v-model.trim="userData.passwordConfirmation"
          />
          <label>Повторите пароль</label>
        </div>
        <div class="form__submit-button">
          <button>{{ buttonText }}</button>
        </div>
      </form>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/form.scss";
</style>
