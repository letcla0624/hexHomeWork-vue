<script setup>
import { useRouter } from "vue-router";
import { reactive, inject } from "vue";

const axios = inject("axios");
const router = useRouter();

const user = reactive({
  username: "",
  password: "",
});

const login = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_API}/admin/signin`,
      user
    );
    const { token, expired } = res.data;
    document.cookie = `hexHomeWorkToken=${token}; expires=${new Date(
      expired
    )};`;
    alert(res.data.message);
    router.push({ name: "week2/products" });
  } catch (err) {
    alert(err.response.data.message);
  }
};
</script>

<template>
  <div class="container text-center">
    <div class="row justify-content-center align-items-center h-100">
      <div>
        <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
        <form id="form" class="form-signin" @submit.prevent="login">
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="username"
              placeholder="name@example.com"
              v-model="user.username"
              required
              autofocus
            />
            <label for="username">Email address</label>
          </div>
          <div class="form-floating">
            <input
              type="password"
              class="form-control"
              id="password"
              placeholder="Password"
              v-model="user.password"
              required
            />
            <label for="password">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
        <p class="mt-5 mb-3 text-muted">&copy; 2021~∞ - 六角學院</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
</style>
