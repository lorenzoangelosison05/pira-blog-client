<template>
  <div>
    <div class="navbar">
      <div class="brand">
        <RouterLink to="/">Simple Blog</RouterLink>
      </div>

      <div v-if="!auth.token">
        <RouterLink to="/login" class="btn">Login</RouterLink>
        <RouterLink to="/register" class="btn">Register</RouterLink>
      </div>

      <div v-else>
        <span class="user">{{ auth.user?.username }}</span>
        <button class="btn" @click="logout">Logout</button>
      </div>
    </div>

    <div class="container">
      <RouterView />
    </div>
  </div>
</template>

<script>
import { getAuth } from "./lib/auth";

export default {
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