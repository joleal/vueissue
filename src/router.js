import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";

// lazy-loaded
const League = () => import("./components/League.vue")

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/league",
    name: "league",
    // lazy-loaded
    component: League,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;