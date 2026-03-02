<template>
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="h1">Posts</div>
       

        <div class="list">
          <div v-for="p in posts" :key="p._id" class="item">
            <RouterLink :to="`/post/${p._id}`">
              <div class="h2">{{ p.title }}</div>
              <div class="small">
                by {{ p.author?.username || "Unknown" }}
                <span class="muted">·</span>
                {{ formatDate(p.createdAt) }}
              </div>
              <div class="hr"></div>
              <div class="muted">{{ preview(p.content) }}</div>
            </RouterLink>
          </div>

          <div v-if="!loading && posts.length === 0" class="notice">No posts yet.</div>
        </div>

        <div v-if="loading" class="notice" style="margin-top:12px;">Loading...</div>
        <div v-if="error" class="notice" style="margin-top:12px;">{{ error }}</div>
      </div>
    </div>

    <div class="col">
      <div class="card">
        <div class="h1">Create Post</div>
       

        <div v-if="!auth.token" class="notice" style="margin-top:12px;">
          Please login to create a post.
        </div>

        <form v-else @submit.prevent="createPost" style="margin-top:10px;">
          <label>Title</label>
          <input v-model="form.title" placeholder="Post title" />

          <label>Content</label>
          <textarea v-model="form.content" placeholder="Write something..."></textarea>

          <div style="display:flex; gap:10px; margin-top:12px;">
            <button class="btn primary" :disabled="saving">
              {{ saving ? "Saving..." : "Publish" }}
            </button>
            <button class="btn" type="button" @click="reset" :disabled="saving">Clear</button>
          </div>

          <div v-if="saveError" class="notice" style="margin-top:12px;">{{ saveError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../lib/api";
import { getAuth } from "../lib/auth";

export default {
  name: "HomeView",
  data() {
    return {
      auth: getAuth(),
      posts: [],
      loading: true,
      error: "",
      saving: false,
      saveError: "",
      form: { title: "", content: "" }
    };
  },
  methods: {
    formatDate(d) {
      try { return new Date(d).toLocaleString(); } catch { return ""; }
    },
    preview(text) {
      if (!text) return "";
      return text.length > 140 ? text.slice(0, 140) + "..." : text;
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get("/api/posts");
        this.posts = res.data.posts || [];
      } catch (e) {
        this.error = e?.response?.data?.error || "Failed to load posts.";
      } finally {
        this.loading = false;
      }
    },
    reset() {
      this.form.title = "";
      this.form.content = "";
      this.saveError = "";
    },
    async createPost() {
      this.saveError = "";
      if (!this.form.title || !this.form.content) {
        this.saveError = "Please fill in title and content.";
        return;
      }
      this.saving = true;
      try {
        await api.post("/api/posts", this.form);
        this.reset();
        await this.load();
      } catch (e) {
        this.saveError = e?.response?.data?.error || "Failed to create post.";
      } finally {
        this.saving = false;
      }
    }
  },
  async mounted() {
    await this.load();
  }
};
</script>
