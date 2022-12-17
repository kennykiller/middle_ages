<template>
  <div id="app-main">
    <!-- <HeaderComponent /> -->
    <Sidebar />
    <router-view />
    <!-- <FooterComponent /> -->
  </div>
</template>

<script setup lang="ts">
// import SocketioService from "./utils/socketio";
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import { useStore } from "./store";
import { onMounted, onBeforeMount } from "vue";
import { authModule } from "./store/auth/auth-actions";
import Sidebar from "./components/Sidebar.vue";

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
  padding: 0;
  width: 100%;
  height: 100%;
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
