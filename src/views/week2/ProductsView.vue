<script setup>
import { useRouter } from "vue-router";
import { reactive, inject, onMounted } from "vue";

const axios = inject("axios");
const router = useRouter();

const products = reactive({ arr: [] });
const tempProduct = reactive({ obj: {} });
const backToHome = { name: "week2" };

const checkAdmin = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_APP_API}/api/user/check`);
    getProducts();
  } catch (err) {
    alert(err.response.data.message);
    router.push(backToHome);
  }
};

const getProducts = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/products`
    );
    products.arr = res.data.products;
  } catch (err) {
    alert(err.response.data.message);
  }
};

const logOut = async () => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_APP_API}/logout`);
    alert(res.data.message);
    router.push(backToHome);
  } catch (err) {
    alert(err.response.data.message);
  }
};

onMounted(() => {
  const AUTH_TOKEN = document.cookie.replace(
    /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  axios.defaults.headers.common.Authorization = AUTH_TOKEN;
  checkAdmin();
});
</script>

<template>
  <div class="container" id="productsPage">
    <div class="row py-3">
      <div class="col-md-6">
        <div class="d-flex justify-content-between align-items-center">
          <h2 class="mb-0">產品列表</h2>
          <button type="button" class="btn btn-outline-primary" @click="logOut">
            登出
          </button>
        </div>
        <table class="table table-hover mt-4">
          <thead>
            <tr>
              <th width="150">產品名稱</th>
              <th width="120">原價</th>
              <th width="120">售價</th>
              <th width="150">是否啟用</th>
              <th width="120">查看細節</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products.arr" :key="product.id">
              <td width="150">{{ product.title }}</td>
              <td width="120">
                {{ product.origin_price }}
              </td>
              <td width="120">
                {{ product.price }}
              </td>
              <td width="150">
                <span v-if="product.is_enabled === 1" class="text-success"
                  >啟用</span
                >
                <span v-else>未啟用</span>
              </td>
              <td width="120">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="tempProduct.obj = product"
                >
                  查看細節
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          目前有 <span>{{ products.arr.length }}</span> 項產品
        </p>
      </div>
      <div class="col-md-6">
        <h2>單一產品細節</h2>
        <template v-if="tempProduct.obj.title">
          <div class="card mb-3">
            <img
              :src="tempProduct.obj.imageUrl"
              class="card-img-top primary-image"
              alt="主圖"
            />
            <div class="card-body">
              <h5 class="card-title">
                {{ tempProduct.obj.title }}
                <span class="badge bg-primary ms-2">{{
                  tempProduct.obj.category
                }}</span>
              </h5>
              <p class="card-text">
                商品描述：{{ tempProduct.obj.description }}
              </p>
              <p class="card-text">商品內容：{{ tempProduct.obj.content }}</p>
              <div class="d-flex">
                <p class="card-text me-2">NT$ {{ tempProduct.obj.price }}</p>
                <p class="card-text text-secondary">
                  <del>NT$ {{ tempProduct.obj.origin_price }}</del>
                </p>
                {{ tempProduct.obj.unit }} / 元
              </div>
              <button
                type="button"
                class="btn btn-outline-danger"
                @click="tempProduct.obj = {}"
              >
                關閉
              </button>
            </div>
          </div>
          <template v-for="(image, id) in tempProduct.obj.imagesUrl" :key="id">
            <img
              :src="image"
              :alt="`${tempProduct.obj.title}_${id}`"
              class="images m-2"
            />
          </template>
        </template>
        <p v-else class="text-secondary">請選擇一個商品查看</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
