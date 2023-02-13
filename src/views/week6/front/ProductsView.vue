<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { storeToRefs } from "pinia";
import { useFrontProductsStore } from "@/stores/frontProductsStore.js";
import { useFrontCartStore } from "@/stores/frontCartStore.js";

const frontProductsStore = useFrontProductsStore();
const { products } = storeToRefs(frontProductsStore);
const { getProducts } = frontProductsStore;

const frontCartStore = useFrontCartStore();
const { loadingCart } = storeToRefs(frontCartStore);
const { addToCart } = frontCartStore;

const router = useRouter();
const loadingItem = ref("");

onMounted(() => {
  getProducts();
});
</script>

<template>
  <div>
    <h1 class="h3 text-center">產品頁</h1>
    <table class="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products.arr" :key="product.id">
          <td>
            <div
              class="img-cover"
              :style="{ backgroundImage: `url('${product.imageUrl}')` }"
            ></div>
          </td>
          <td>
            {{ product.title }}
          </td>
          <td>
            <div class="h5" v-if="product.price === product.origin_price">
              ${{ product.origin_price }} 元
            </div>
            <div v-else>
              <del class="h6">原價 ${{ product.origin_price }} 元</del>
              <div class="h5 text-danger">現在只要 ${{ product.price }} 元</div>
            </div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="router.push(`prod/${product.id}`)"
                :disabled="loadingItem === product.id"
              >
                <div
                  v-if="loadingItem === product.id"
                  class="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span v-else>查看更多</span>
              </button>
              <button
                type="button"
                class="btn btn-outline-primary"
                @click="addToCart(product.id)"
                :disabled="loadingCart === product.id"
              >
                <div
                  v-if="loadingCart === product.id"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span>加到購物車</span>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
