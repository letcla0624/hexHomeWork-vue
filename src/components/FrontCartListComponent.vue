<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { storeToRefs } from "pinia";
import { useFrontCartStore } from "@/stores/frontCartStore.js";

const frontCartStore = useFrontCartStore();
const { cart } = storeToRefs(frontCartStore);
const { getCarts } = frontCartStore;

const loadingCart = ref("");
const updateCart = async (item) => {
  loadingCart.value = item.id;

  const data = reactive({
    product_id: item.product_id,
    qty: item.qty,
  });
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/cart/${item.id}`,
      { data }
    );

    alert(res.data.message);
    loadingCart.value = "";
    getCarts();
  } catch (err) {
    loadingCart.value = "";
    alert(err.response.data.message);
  }
};

const deleteCartItem = async (id) => {
  loadingCart.value = id;

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/cart/${id}`
    );

    alert(res.data.message);
    loadingCart.value = "";
    getCarts();
  } catch (err) {
    loadingCart.value = "";
    alert(err.response.data.message);
  }
};

const loading = ref(false);
const deleteAllCarts = async () => {
  loading.value = true;

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/carts`
    );

    alert(res.data.message);
    loading.value = false;
    getCarts();
  } catch (err) {
    loading.value = false;
    alert(err.response.data.message);
  }
};

onMounted(() => {
  getCarts();
});
</script>
<template>
  <h2 v-if="cart.arr.total === 0" class="h3 text-center mt-5">
    目前購物車沒有東西喔~ 趕快去購物吧~(๑•̀ㅂ•́)و✧
  </h2>
  <div v-else>
    <div class="text-end">
      <button
        class="btn btn-outline-danger"
        type="button"
        @click="deleteAllCarts"
        :disabled="cart.arr.total === 0 || loading"
      >
        <div
          v-if="loading"
          class="spinner-border spinner-border-sm"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
        清空購物車
      </button>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th class="text-end">單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.arr">
          <tr v-for="item in cart.arr.carts" :key="item.id">
            <td>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="deleteCartItem(item.id)"
                :disabled="loadingCart === item.id"
              >
                <div
                  v-if="loadingCart === item.id"
                  class="spinner-border spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span v-else>
                  <i class="fs-6 bi bi-trash3"></i>
                </span>
              </button>
            </td>
            <td>
              {{ item.product.title }}
            </td>
            <td>
              <div class="input-group input-group-sm my-3">
                <select
                  class="form-select"
                  v-model="item.qty"
                  @change="updateCart(item)"
                  :disabled="loadingCart === item.id"
                >
                  <option v-for="i in 20" :key="i" :value="i">
                    {{ i }}
                  </option>
                </select>
                <label class="input-group-text">
                  {{ item.product.unit }}
                </label>
              </div>
            </td>
            <td class="text-end">
              <div v-if="item.product.origin_price !== item.product.price">
                <small class="text-secondary">
                  <del
                    >原價： ${{ item.product.origin_price }} x {{ item.qty }} =
                    ${{ item.product.origin_price * item.qty }}
                  </del>
                </small>
                <br />
                <small class="text-success">
                  折扣價： ${{ item.product.price }} x {{ item.qty }} = ${{
                    item.final_total
                  }}
                </small>
              </div>
              <div v-else>${{ item.final_total }}</div>
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">${{ cart.arr.total }}</td>
        </tr>
        <tr v-if="cart.arr.final_total !== cart.arr.total">
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ cart.arr.final_total }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style lang=""></style>
