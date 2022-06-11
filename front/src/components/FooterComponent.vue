<template>
  <nav class="footer__nav">
    <ul class="footer__items-list outer-list">
      <li class="outer-list__item base">
        <div class="base__wrapper">
          <img src="@/assets/images/logo.png" alt="logo" />
          <router-link to="/"
            ><img src="@/assets/images/cinema_name.png" alt="logo"
          /></router-link>
        </div>
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
                <img src="@/assets/svg/insta.svg" />
              </a>
            </li>
            <li class="socials-list__item">
              <a href="https://vk.com">
                <img src="@/assets/svg/vk.svg" />
              </a>
            </li>
            <li class="socials-list__item">
              <a href="https://telegram.org/">
                <img src="@/assets/svg/tg.svg" />
              </a>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Acme&display=swap");
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
      font-family: "Acme";
      font-size: 1.5rem;
      line-height: 25px;
      text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
  }
}
.base {
  &__wrapper {
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
