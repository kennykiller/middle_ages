<template>
  <div id="app" class="max-w-screen-xl flex justify-center flex-wrap w-full">
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
  /* html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
  *, ::before, ::active {
    box-sizing: border-box;
  }
  #app {
    display: flex;
    flex-direction: column;
    padding: 0;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
  }
  ul {
    list-style: none;
  }
  a {
    text-decoration: none;
  } */
</style>
