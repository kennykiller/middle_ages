<script setup lang="ts"></script>

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
      <form @submit.prevent="" class="form">
        <div class="form__item">
          <input type="email" />
          <label>Email</label>
        </div>
        <div class="form__item">
          <input type="password" />
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
