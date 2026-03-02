<template>
  <div class="card" style="max-width:520px; margin:0 auto;">
    <div class="h1">Login</div>
    <div class="muted">Enter your credentials</div>

    <form @submit.prevent="login" style="margin-top:10px;">
      <label>Email</label>
      <input v-model="form.email" placeholder="user@mail.com" />

      <label>Password</label>
      <input v-model="form.password" type="password" placeholder="••••••••" />

      <div style="display:flex; gap:10px; margin-top:12px;">
        <button class="btn primary" :disabled="loading">{{ loading ? "Logging in..." : "Login" }}</button>
        <RouterLink class="btn" to="/register">Register</RouterLink>
      </div>

      <div v-if="error" class="notice" style="margin-top:12px;">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import api from "../lib/api";
import { setAuth } from "../lib/auth";

export default {
  name: "LoginView",
  data() {
    return {
      loading: false,
      error: "",
      form: { email: "", password: "" }
    };
  },
  methods: {
    async login() {
      this.error = "";
      if (!this.form.email || !this.form.password) {
        this.error = "Please fill in email and password.";
        return;
      }
      this.loading = true;
      try {
        const res = await api.post("/api/auth/login", this.form);
        setAuth({ token: res.data.token, user: res.data.user });
        this.$emit("auth-changed");
        this.$router.push("/");
      } catch (e) {
        this.error = e?.response?.data?.error || "Login failed.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
