<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

import { storeToRefs } from "pinia";
import { useFrontCartStore } from "@/stores/frontCartStore.js";
const frontCartStore = useFrontCartStore();
const { loadingCart } = storeToRefs(frontCartStore);
const { addToCart } = frontCartStore;

const route = useRoute();

const product = reactive({ obj: {} });
const getProduct = async () => {
  const { id } = route.params;
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/product/${id}`
    );

    product.obj = res.data.product;
  } catch (err) {
    alert(err.response.data.message);
  }
};

const qty = ref(1);
const defaultQty = () => {
  setTimeout(() => {
    qty.value = 1;
  }, 2000);
};

onMounted(() => {
  getProduct();
});
</script>

<template>
  <div>
    <div class="row">
      <div class="col-sm-6">
        <img class="img-fluid" :src="product.obj.imagesUrl" alt="" />
      </div>
      <div class="col-sm-6">
        <span class="badge bg-primary rounded-pill">{{
          product.obj.category
        }}</span>
        <h1>{{ product.obj.title }}</h1>
        <p>商品描述：{{ product.obj.description }}</p>
        <p>商品內容：{{ product.obj.content }}</p>
        <div class="h5" v-if="!product.obj.price">
          {{ product.obj.origin_price }} 元
        </div>
        <del class="h6" v-if="product.obj.price"
          >原價 {{ product.obj.origin_price }} 元</del
        >
        <div class="h5" v-if="product.obj.price">
          現在只要 {{ product.obj.price }} 元
        </div>
        <div>
          <div class="input-group">
            <select class="form-select" v-model="qty">
              <option v-for="i in 20" :key="`num_${i}`" :value="i">
                {{ i }}
              </option>
            </select>
            <button
              type="button"
              class="btn btn-primary"
              @click="
                addToCart(product.obj.id, qty);
                defaultQty();
              "
              :disabled="loadingCart === product.obj.id"
            >
              <div
                v-if="loadingCart === product.obj.id"
                class="spinner-border spinner-border-sm"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
