<template>
  <nav class="sidebar__container">
    <ul class="sidebar__list">
      <li><router-link to="/films">Фильмы</router-link></li>
      <li><router-link to="/schedule">Расписание</router-link></li>
      <li><router-link to="/cinema">Кинотеатры</router-link></li>
    </ul>
  </nav>
</template>

<style lang="scss" scoped>
.sidebar__container {
  max-width: 10rem;
  .sidebar__list {
    display: flex;
    flex-direction: column;
  }
}
</style>