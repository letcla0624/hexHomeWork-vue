<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import ProductListModalComponent, {
  prodModal,
} from "@/components/modal/ProductListModalComponent.vue";
import FrontCartListComponent from "@/components/FrontCartListComponent.vue";
import FormValidateComponent from "@/components/FormValidateComponent.vue";

import { storeToRefs } from "pinia";
import { useFrontProductsStore } from "@/stores/frontProductsStore.js";
import { useFrontCartStore } from "@/stores/frontCartStore.js";

const frontProductsStore = useFrontProductsStore();
const { products } = storeToRefs(frontProductsStore);
const { getProducts } = frontProductsStore;

const frontCartStore = useFrontCartStore();
const { getCarts } = frontCartStore;

const loadingItem = ref("");
const product = reactive({ obj: {} });
const getProduct = async (id) => {
  try {
    loadingItem.value = id;

    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/product/${id}`
    );

    loadingItem.value = "";
    product.obj = res.data.product;
    prodModal.show();
  } catch (err) {
    loadingItem.value = "";
    alert(err.response.data.message);
  }
};

const loadingCart = ref("");
const addToCart = async (product_id, qty = 1) => {
  try {
    loadingCart.value = product_id;

    const data = reactive({ product_id, qty });

    const res = await axios.post(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/cart`,
      { data }
    );

    alert(res.data.message);
    loadingCart.value = "";
    prodModal.hide();
    getCarts();
  } catch (err) {
    loadingCart.value = "";
    alert(err.response.data.message);
  }
};

onMounted(() => {
  getProducts();
});
</script>
<template>
  <div class="container">
    <div class="mt-4">
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
                <div class="h5 text-danger">
                  現在只要 ${{ product.price }} 元
                </div>
              </div>
            </td>
            <td>
              <div class="btn-group btn-group-sm">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="getProduct(product.id)"
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
                    class="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <span v-else>加到購物車</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <FrontCartListComponent />
    </div>
    <FormValidateComponent />
  </div>

  <ProductListModalComponent
    :product="product.obj"
    :loading-cart="loadingCart"
    @add-to-cart="addToCart"
  />
</template>

<style lang="scss">
.img-cover {
  width: 100px;
  height: 100px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
}
</style>
