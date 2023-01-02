<script setup>
import { RouterView } from "vue-router";
import HeaderComponent from "@/components/HeaderComponent.vue";
</script>

<template>
  <HeaderComponent />
  <RouterView />
</template>

<style>
html,
body {
  height: 100%;
}
.container {
  height: calc(100vh - 56px);
}
#nprogress .bar {
  background: var(--bs-primary) !important;
  height: 6px !important;
}
</style>
