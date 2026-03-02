<template>
  <div class="card" style="max-width:520px; margin:0 auto;">
    <div class="h1">Register</div>
    <div class="muted">Create a new account</div>

    <form @submit.prevent="register" style="margin-top:10px;">
      <label>Email</label>
      <input v-model="form.email" placeholder="user@mail.com" />

      <label>Username</label>
      <input v-model="form.username" placeholder="user" />

      <label>Password</label>
      <input v-model="form.password" type="password" placeholder="min 6 chars" />

      <div style="display:flex; gap:10px; margin-top:12px;">
        <button class="btn primary" :disabled="loading">{{ loading ? "Creating..." : "Register" }}</button>
        <RouterLink class="btn" to="/login">Login</RouterLink>
      </div>

      <div v-if="message" class="notice" style="margin-top:12px;">{{ message }}</div>
      <div v-if="error" class="notice" style="margin-top:12px;">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import api from "../lib/api";

export default {
  name: "RegisterView",
  data() {
    return {
      loading: false,
      error: "",
      message: "",
      form: { email: "", username: "", password: "" }
    };
  },
  methods: {
    async register() {
      this.error = "";
      this.message = "";
      if (!this.form.email || !this.form.username || !this.form.password) {
        this.error = "Please fill in all fields.";
        return;
      }
      this.loading = true;
      try {
        await api.post("/api/auth/register", this.form);
        this.message = "Registered. You can login now.";
        this.form.password = "";
      } catch (e) {
        this.error = e?.response?.data?.error || "Registration failed.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
