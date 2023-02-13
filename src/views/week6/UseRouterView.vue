<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div>
    <div class="container">
      <ul
        class="list-unstyled w-100 mx-auto mb-2 mb-lg-0 d-flex justify-content-center py-5"
      >
        <li class="mx-3">
          <RouterLink to="/week6" class="nav-link" aria-current="page"
            >首頁</RouterLink
          >
        </li>
        <li class="mx-3">
          <RouterLink to="/week6/products" class="nav-link">產品頁</RouterLink>
        </li>
        <li class="mx-3">
          <RouterLink to="/week6/cart" class="nav-link">購物車</RouterLink>
        </li>
        <li class="mx-3">
          <RouterLink to="/week6/login" class="nav-link">進入後台</RouterLink>
        </li>
      </ul>
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
