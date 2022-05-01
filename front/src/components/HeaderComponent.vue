<template>
  <div class="header__wrapper">
    <nav class="header__nav">
      <ul class="header__items-list list">
        <li class="list__item">
          <router-link to="/">Dota Cinema</router-link>
        </li>
        <li class="list__item">
          <router-link to="auth">Личный кабинет</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.header__wrapper {
  width: 100%;
  padding: 1rem 0;
  nav {
    width: 100%;
    padding: 1rem;
    ul {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
    }
    li a {
      font-size: 1.5rem;
      text-shadow: 0 0 1px (rgb(92, 92, 190));
    }
  }
}
</style>
