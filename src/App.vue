<template>
  <div>
    <nav class="navbar">
      <div class="nav-left">
        <RouterLink to="/" class="brand">Simple Blog</RouterLink>
      </div>

      <div class="nav-right" v-if="!auth.token">
        <RouterLink to="/login" class="btn">Login</RouterLink>
        <RouterLink to="/register" class="btn">Register</RouterLink>
      </div>

      <div class="nav-right" v-else>
        <span class="user">
          {{ auth.user?.username }}
        </span>
        <button class="btn" @click="logout">Logout</button>
      </div>
    </nav>

    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { getAuth } from "./lib/auth";

export default {
  name: "App",
  data() {
    return {
      auth: getAuth()
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.auth = { token: null, user: null };
      this.$router.push("/");
    }
  }
};
</script>