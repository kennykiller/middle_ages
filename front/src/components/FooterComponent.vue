<template>
  <nav class="footer__nav">
    <ul class="footer__items-list outer-list">
      <li class="outer-list__item">
        <router-link to="/">
          <p>Dota Cinema</p>
        </router-link>
      </li>
      <li class="outer-list__item">
        <router-link to="/">
          <p>Санкт-Петербург</p>
        </router-link>
      </li>
      <li class="outer-list__item socials">
        <div class="socials__wrapper">
          <ul class="socials__items-list socials-list">
            <li class="socials-list__item">
              <a href="https://www.instagram.com">
                <img src="../assets/svg/insta.svg" />
              </a>
            </li>
            <li class="socials-list__item">
              <a href="https://vk.com">
                <img src="../assets/svg/vk.svg" />
              </a>
            </li>
            <li class="socials-list__item">
              <a href="https://telegram.org/">
                <img src="../assets/svg/tg.svg" />
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.footer__nav {
  width: 100%;
  padding: 1rem;
  ul {
    display: flex;
  }
  .outer-list {
    justify-content: space-between;
    align-items: center;
    &__item p {
      font-size: 1.5rem;
      text-shadow: 0 0 1px rgb(92, 92, 190);
    }
  }
}
.socials-list__item {
  & a img {
    width: 48px;
    height: 48px;
  }
  &:not(:last-child) {
    margin-right: 1rem;
  }
}
</style>
