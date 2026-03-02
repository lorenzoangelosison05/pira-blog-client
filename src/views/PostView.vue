<template>
  <div class="card">
    <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap;">
      <div>
        <div class="h1">{{ post?.title || "Post" }}</div>
        <div class="small">
          by {{ post?.author?.username || "Unknown" }}
          <span class="muted">·</span>
          {{ formatDate(post?.createdAt) }}
        </div>
      </div>

      <div style="display:flex; gap:10px; align-items:flex-start;">
        <button v-if="canEdit" class="btn" @click="editMode = !editMode">
          {{ editMode ? "Cancel" : "Edit" }}
        </button>
        <button v-if="canDelete" class="btn danger" @click="deletePost" :disabled="deleting">
          {{ deleting ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>

    <div class="hr"></div>

    <div v-if="loading" class="notice">Loading...</div>
    <div v-if="error" class="notice">{{ error }}</div>

    <div v-if="post && !editMode" class="muted" style="white-space:pre-wrap; line-height:1.6;">
      {{ post.content }}
    </div>

    <div v-if="post && editMode" class="card" style="margin-top:12px;">
      <div class="h2">Edit Post</div>
      <label>Title</label>
      <input v-model="edit.title" />

      <label>Content</label>
      <textarea v-model="edit.content"></textarea>

      <div style="display:flex; gap:10px; margin-top:12px;">
        <button class="btn primary" @click="updatePost" :disabled="saving">
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>

      <div v-if="saveError" class="notice" style="margin-top:12px;">{{ saveError }}</div>
    </div>

    <div class="hr"></div>

    <div class="h2">Comments</div>
    <div class="muted">Shown when viewing a post</div>

    <div class="list" style="margin-top:12px;">
      <div v-for="c in comments" :key="c._id" class="item">
        <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap;">
          <div>
            <div class="small">
              {{ c.author?.username || "Unknown" }}
              <span class="muted">·</span>
              {{ formatDate(c.createdAt) }}
            </div>
            <div style="white-space:pre-wrap; margin-top:6px;">{{ c.text }}</div>
          </div>

          <button
            v-if="canDeleteComment(c)"
            class="btn danger"
            @click="deleteComment(c._id)"
            :disabled="deletingCommentId === c._id"
          >
            {{ deletingCommentId === c._id ? "..." : "Delete" }}
          </button>
        </div>
      </div>

      <div v-if="!loading && comments.length === 0" class="notice">No comments yet.</div>
    </div>

    <div class="hr"></div>

    <div class="h2">Add Comment</div>

    <div v-if="!auth.token" class="notice" style="margin-top:12px;">
      Please login to comment.
    </div>

    <div v-else style="margin-top:10px;">
      <textarea v-model="commentText" placeholder="Write a comment..."></textarea>
      <div style="display:flex; gap:10px; margin-top:12px;">
        <button class="btn primary" @click="addComment" :disabled="commentSaving">
          {{ commentSaving ? "Posting..." : "Post Comment" }}
        </button>
      </div>
      <div v-if="commentError" class="notice" style="margin-top:12px;">{{ commentError }}</div>
    </div>

    <div style="height:8px;"></div>
    <RouterLink class="btn" to="/">Back</RouterLink>
  </div>
</template>

<script>
import api from "../lib/api";
import { getAuth } from "../lib/auth";

export default {
  name: "PostView",
  data() {
    return {
      auth: getAuth(),
      post: null,
      comments: [],
      loading: true,
      error: "",
      editMode: false,
      edit: { title: "", content: "" },
      saving: false,
      saveError: "",
      deleting: false,
      commentText: "",
      commentSaving: false,
      commentError: "",
      deletingCommentId: ""
    };
  },
  computed: {
    canEdit() {
      if (!this.auth.token || !this.post) return false;
      const isOwner = this.post?.author?._id === this.auth.user?.id;
      const isAdmin = this.auth.user?.role === "admin";
      return isOwner || isAdmin;
    },
    canDelete() {
      return this.canEdit;
    }
  },
  methods: {
    formatDate(d) {
      try { return new Date(d).toLocaleString(); } catch { return ""; }
    },
    async load() {
      this.loading = true;
      this.error = "";
      try {
        const res = await api.get(`/api/posts/${this.$route.params.id}`);
        this.post = res.data.post;
        this.comments = res.data.comments || [];
        this.edit.title = this.post?.title || "";
        this.edit.content = this.post?.content || "";
      } catch (e) {
        this.error = e?.response?.data?.error || "Failed to load post.";
      } finally {
        this.loading = false;
      }
    },
    async updatePost() {
      this.saveError = "";
      this.saving = true;
      try {
        const res = await api.put(`/api/posts/${this.post._id}`, this.edit);
        this.post = res.data.post;
        this.editMode = false;
      } catch (e) {
        this.saveError = e?.response?.data?.error || "Failed to update post.";
      } finally {
        this.saving = false;
      }
    },
    async deletePost() {
      if (!confirm("Delete this post?")) return;
      this.deleting = true;
      try {
        await api.delete(`/api/posts/${this.post._id}`);
        this.$router.push("/");
      } catch (e) {
        alert(e?.response?.data?.error || "Failed to delete post.");
      } finally {
        this.deleting = false;
      }
    },
    canDeleteComment(c) {
      if (!this.auth.token) return false;
      const isOwner = c?.author?._id === this.auth.user?.id;
      const isAdmin = this.auth.user?.role === "admin";
      return isOwner || isAdmin;
    },
    async addComment() {
      this.commentError = "";
      if (!this.commentText.trim()) {
        this.commentError = "Please write a comment.";
        return;
      }
      this.commentSaving = true;
      try {
        await api.post(`/api/comments/post/${this.post._id}`, { text: this.commentText });
        this.commentText = "";
        await this.load();
      } catch (e) {
        this.commentError = e?.response?.data?.error || "Failed to add comment.";
      } finally {
        this.commentSaving = false;
      }
    },
    async deleteComment(id) {
      if (!confirm("Delete this comment?")) return;
      this.deletingCommentId = id;
      try {
        await api.delete(`/api/comments/${id}`);
        await this.load();
      } catch (e) {
        alert(e?.response?.data?.error || "Failed to delete comment.");
      } finally {
        this.deletingCommentId = "";
      }
    }
  },
  async mounted() {
    await this.load();
  }
};
</script>
