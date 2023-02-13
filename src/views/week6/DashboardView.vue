<script setup>
import { RouterLink, RouterView, useRouter } from "vue-router";
import { onMounted } from "vue";
import LogOutComponent from "@/components/LogOutComponent.vue";
import { useCheckToken } from "@/composables/useCheckToken.js";
import axios from "axios";

const router = useRouter();
const backToHome = { name: "week6/login" };

const checkAdmin = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_APP_API}/api/user/check`);
  } catch (err) {
    alert(err.response.data.message);
    router.push(backToHome);
  }
};

onMounted(() => {
  useCheckToken();
  checkAdmin();
});
</script>

<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <ul class="list-unstyled mb-2 mb-lg-0 d-flex py-5">
          <li class="mx-3">
            <RouterLink to="/week6/admin" class="nav-link">
              後台產品列表頁
            </RouterLink>
          </li>
          <li class="mx-3">
            <RouterLink to="/week6/admin/orders" class="nav-link">
              後台訂單頁
            </RouterLink>
          </li>
          <li class="mx-3">
            <RouterLink to="/week6" class="nav-link">回前台</RouterLink>
          </li>
        </ul>
        <LogOutComponent routeName="week6/login" />
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav-link {
  &.router-link-exact-active {
    color: var(--bs-primary);
  }
}
</style>
