import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { authModule } from "@/store/auth/auth-actions";
const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});
router.beforeEach((to, from, next) => {
    if (/^(\/admin)/.test(to.path)) {
        if (authModule.isAdmin) {
            next();
        }
        else {
            router.push({ path: "/" });
        }
    }
    else {
        next();
    }
});
export default router;
