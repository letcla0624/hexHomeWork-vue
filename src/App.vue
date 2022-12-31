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
</style>
