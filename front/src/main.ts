import { createApp } from "../node_modules/vue";
import { store, key } from "@/store";
import App from "./App.vue";
import router from "./router";
import "@/assets/styles/main.scss";
import "@/utils/axios";

const app = createApp(App);

app.use(router);
app.use(store, key);

app.mount("#app");
