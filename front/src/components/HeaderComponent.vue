<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import BaseBadge from "@/components/UI/BaseBadge.vue";
import { authModule } from "@/store/auth/auth-actions";

const router = useRouter();

// const isLoggedIn = computed(() => {
//   console.log(authModule.isAuthenticated);
//   return authModule.isAuthenticated;
// });

let isLoggedIn = ref(false);

authModule.$watch(
  (authModule) => authModule.isAuthenticated,
  (val) => (isLoggedIn.value = val)
);

const logoutHandler = async () => {
  await authModule.logout();
  router.push("/");
};
</script>

<template>
  <div class="header__wrapper">
    <nav class="header__nav">
      <ul class="header__items-list list">
        <li class="list__item sections">
          <div class="sections__base-wrapper">
            <img src="@/assets/images/logo.png" alt="logo" />
            <router-link to="/"
              ><img src="@/assets/images/cinema_name.png" alt="logo"
            /></router-link>
          </div>
          <ul class="sections__items-list sections-list">
            <li class="sections-list__item">
              <router-link to="/schedule">Расписание</router-link>
            </li>
            <li class="sections-list__item">
              <router-link to="/films">Фильмы</router-link>
            </li>
          </ul>
        </li>
        <li class="list__item auth">
          <div class="auth__wrapper">
            <BaseBadge
              @click="logoutHandler"
              v-if="isLoggedIn"
              popover
              popover-text="Выйти"
            >
              <template #image>
                <img src="@/assets/images/logout.png" alt="logout" />
              </template>
            </BaseBadge>
            <router-link to="/auth" v-if="!isLoggedIn">
              <BaseBadge popover popover-text="Войти">
                <template #image>
                  <img src="@/assets/images/login.png" alt="login" />
                </template>
              </BaseBadge>
            </router-link>
            <router-link to="/signup" v-if="!isLoggedIn">
              <BaseBadge popover popover-text="Регистрация">
                <template #image
                  ><img src="@/assets/images/signup.png" alt="signup"
                /></template>
              </BaseBadge>
            </router-link>
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Acme&display=swap");
.header {
  &__wrapper {
    width: 100%;
    padding: 1rem 0;
  }
  &__nav {
    width: 100%;
    padding: 1rem;
    ul {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
    li a {
      font-family: "Acme";
      font-size: 1.5rem;
      line-height: 25px;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }
  &__items-list {
    background: #fff;
    padding: 10px;
    border-radius: 0.5rem;
    box-shadow: 0 4px 15px #88b8fe;
  }
}
.sections {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  &__base-wrapper {
    position: relative;
    min-width: 300px;
    display: flex;
    & > img,
    a {
      height: 48px;
      img {
        position: absolute;
        left: 60px;
        top: 4px;
      }
    }
  }
  &-list {
    display: flex;
    gap: 20px;
    &__item {
      &:hover a {
        color: #88b8fe;
      }
      .router-link-exact-active {
        border-bottom: 5px solid #88b8fe;
      }
    }
  }
}
.auth {
  &__wrapper {
    display: flex;
    align-items: center;
    gap: 15px;
  }
}
</style>
