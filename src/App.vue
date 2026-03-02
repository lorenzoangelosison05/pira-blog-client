<template>
  <div class="container">
    <div class="nav">
      <div style="display:flex; align-items:center; gap:12px;">
        <RouterLink class="brand" to="/">Simple Blog</RouterLink>
      </div>

      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; justify-content:flex-end;">
        <span v-if="auth.user" class="pill">
          {{ auth.user.username }}
          <span class="muted">·</span>
          <span class="muted">{{ auth.user.role }}</span>
        </span>

        <RouterLink v-if="!auth.token" class="btn" to="/login">Login</RouterLink>
        <RouterLink v-if="!auth.token" class="btn" to="/register">Register</RouterLink>
        <button v-if="auth.token" class="btn" @click="logout">Logout</button>
      </div>
    </div>

    <div style="height:14px;"></div>

    <div class="page">
      <RouterView @auth-changed="refreshAuth" />
    </div>
  </div>
</template>

<script>
import { getAuth, clearAuth } from "./lib/auth";

export default {
  name: "App",
  data() {
    return {
      auth: getAuth()
    };
  },
  methods: {
    refreshAuth() {
      this.auth = getAuth();
    },
    logout() {
      clearAuth();
      this.auth = { token: null, user: null };
      this.$router.push("/login");
    }
  }
};
</script>