import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/index",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("@/views/IndexView.vue"),
      children: [
        {
          path: "index",
          name: "index",
          component: () => import("@/components/HelloWorld.vue"),
        },
        {
          path: "session",
          name: "session",
          component: () => import("@/components/SessionComponent/SessionComponent.vue")
        }
      ],
    },
  ],
});

export default router;
