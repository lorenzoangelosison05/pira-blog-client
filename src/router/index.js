import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PostView from "../views/PostView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/post/:id", name: "post", component: PostView, props: true },
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
