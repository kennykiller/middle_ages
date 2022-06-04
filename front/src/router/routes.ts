import FilmsPage from "@/views/FilmsPage.vue";
import FilmPage from "@/views/FilmPage.vue";
import HomePage from "@/views/HomePage.vue";
import TicketsPage from "@/views/TicketsPage.vue";
import LoginPage from "@/views/LoginPage.vue";
import AdminPage from "@/views/AdminPage.vue";
import SignupPage from "@/views/SignupPage.vue";
import AdminDiscount from "@/components/admin/AdminDiscount.vue";
import AdminFilm from "@/components/admin/AdminFilm.vue";
import AdminSessions from "@/components/admin/AdminSessions.vue";
import NotFound from "@/views/NotFound.vue";

export const routes = [
  { path: "/", component: HomePage, meta: { title: "Home" } },
  { path: "/films", component: FilmsPage, meta: { title: "Films" } },
  { path: "/films/:id", component: FilmPage, meta: { title: "Film" } },
  { path: "/tickets", component: TicketsPage, meta: { title: "Tickets" } },
  {
    name: "auth",
    path: "/auth",
    component: LoginPage,
    meta: { title: "Login" },
  },
  {
    name: "signup",
    path: "/signup",
    component: SignupPage,
    meta: { title: "Signup" },
  },
  { path: "/admin", component: AdminPage, meta: { title: "Admin Page" } },
  { path: "/admin/film", component: AdminFilm, meta: { title: "Add film" } },
  {
    path: "/admin/discount",
    component: AdminDiscount,
    meta: { title: "Add discount" },
  },
  {
    path: "/admin/sessions",
    component: AdminSessions,
    meta: { title: "Set timetable" },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFound,
    meta: { title: "Page not found" },
  },
];
