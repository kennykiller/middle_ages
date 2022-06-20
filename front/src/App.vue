<template>
  <div id="app-main">
    <HeaderComponent />
    <router-view />
    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
// import SocketioService from "./utils/socketio";
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import { useStore } from "./store";
import { onMounted, onBeforeMount } from "vue";
import { authModule } from "./store/auth/auth-actions";

const store = useStore();
const resizeControl = () => {
  store.commit("setWindowWidth", window.innerWidth);
};
onBeforeMount(() => {
  authModule.checkAuthentication();
});
onMounted(() => {
  window.addEventListener("resize", resizeControl);
  resizeControl();
});

// onBeforeMount(() => {
//   SocketioService.setupSocketConnection();
// });
// onBeforeUnmount(() => {
//   SocketioService.disconnect();
// });
</script>

<style lang="scss">
#app-main {
  display: flex;
  flex-direction: column;
  padding: 0;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
}
ul {
  list-style: none;
  padding-left: 0;
}
a {
  text-decoration: none;
  color: #0c3779;
}
</style>
