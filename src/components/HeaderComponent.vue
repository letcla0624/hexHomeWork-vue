<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="#">HexHomework</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <RouterLink to="/" class="nav-link" aria-current="page"
                >week1</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink to="/week2" class="nav-link">week2</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/week3" class="nav-link">week3</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/week4" class="nav-link">week4</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/week5" class="nav-link">week5</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<style scoped>
img {
  object-fit: contain;
  max-width: 100%;
}
.primary-image {
  height: 300px;
}
.images {
  height: 150px;
}
</style>
