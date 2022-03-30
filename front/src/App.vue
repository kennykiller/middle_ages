<template>
  <div id="app-main">
    <HeaderComponent />
    <router-view />
     <FooterComponent/>
  </div>
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
  export default {
    name: "App",
    components: { HeaderComponent, FooterComponent }
}
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  *, ::before, ::active {
    box-sizing: border-box;
  }
  #app-main {
    display: flex;
    flex-direction: column;
    padding: 0;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px;
    overflow: hidden;
  }
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
  }
</style>
