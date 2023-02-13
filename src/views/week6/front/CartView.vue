<script setup>
import { onMounted } from "vue";
import FrontCartListComponent from "@/components/FrontCartListComponent.vue";
import FormValidateComponent from "@/components/FormValidateComponent.vue";

import { useFrontCartStore } from "@/stores/frontCartStore.js";
const frontCartStore = useFrontCartStore();
const { getCarts } = frontCartStore;

onMounted(() => {
  getCarts();
});
</script>

<template>
  <div>
    <h1 class="h3 text-center">購物車頁</h1>
    <FrontCartListComponent />
    <FormValidateComponent />
  </div>
</template>
