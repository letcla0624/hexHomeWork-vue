<script setup>
import { useRouter } from "vue-router";
import { ref, reactive, onMounted } from "vue";
import axios from "axios";
import { useCheckToken } from "@/composables/useCheckToken.js";
import LogOutComponent from "@/components/LogOutComponent.vue";
import PageComponent from "@/components/PageComponent.vue";
import ProductModalComponent, {
  prodModal,
} from "@/components/modal/ProductModalComponent.vue";
import DeleteModalComponent, {
  delModal,
} from "@/components/modal/DeleteModalComponent.vue";

const router = useRouter();
const products = reactive({ arr: [] });
const tempProduct = reactive({ obj: { imagesUrl: [] } });
const pagination = reactive({ obj: {} });
const isNew = ref(false);

const checkAdmin = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_APP_API}/api/user/check`);
    getProducts();
  } catch (err) {
    alert(err.response.data.message);
    router.push({ name: "week4" });
  }
};

const getProducts = async (page = 1) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/products?page=${page}`
    );

    // 最後新增放第一個
    products.arr = Object.keys(res.data.products)
      .map((key) => res.data.products[key])
      .reverse();

    pagination.obj = res.data.pagination;
  } catch (err) {
    alert(err.response.data.message);
  }
};

const openModal = (txt, product) => {
  if (txt === "new") {
    isNew.value = true;
    tempProduct.obj = {
      imagesUrl: [],
    };
    prodModal.show();
  } else if (txt === "edit") {
    isNew.value = false;
    tempProduct.obj = JSON.parse(JSON.stringify(product));
    prodModal.show();
  } else if (txt === "delete") {
    isNew.value = false;
    tempProduct.obj = { ...product };
    delModal.show();
  }
};

onMounted(() => {
  useCheckToken();
  checkAdmin();
});
</script>

<template>
  <div class="container">
    <div class="text-end py-4">
      <LogOutComponent routeName="week4" />
      <button class="btn btn-primary ms-2" @click="openModal('new')">
        建立新的產品
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120" class="text-end">原價</th>
          <th width="120" class="text-end">售價</th>
          <th width="100" class="text-end">是否啟用</th>
          <th width="120" class="text-end">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products.arr" :key="product.id">
          <td>{{ product.category }}</td>
          <td>{{ product.title }}</td>
          <td class="text-end">{{ product.origin_price }}</td>
          <td class="text-end">{{ product.price }}</td>
          <td class="text-end">
            <span v-if="product.is_enabled === 1" class="text-success">
              啟用
            </span>
            <span v-else>未啟用</span>
          </td>
          <td class="text-end">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PageComponent :pages="pagination" @emit-page="getProducts" />
  </div>

  <ProductModalComponent
    :is-new="isNew"
    :admin-prod="tempProduct"
    @get-prods="getProducts"
  />

  <DeleteModalComponent :admin-prod="tempProduct" @get-prods="getProducts" />
</template>
