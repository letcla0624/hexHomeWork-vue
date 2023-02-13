<script setup>
import { reactive, onMounted } from "vue";
import { useCheckToken } from "@/composables/useCheckToken.js";
import PageComponent from "@/components/PageComponent.vue";
import axios from "axios";
import { useLoading } from "vue-loading-overlay";

const $loading = useLoading({
  color: "var(--bs-primary)",
});

const pagination = reactive({ obj: {} });
const orders = reactive({ arr: [] });
const getOrders = async (page = 1) => {
  const loader = $loading.show();
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/orders?page=${page}`
    );

    loader.hide();
    orders.arr = res.data.orders;
    pagination.obj = res.data.pagination;
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

const date = (time) => {
  const localDate = new Date(time * 1000);
  return localDate.toLocaleDateString();
};

onMounted(() => {
  useCheckToken();
  getOrders();
});
</script>

<template>
  <div>
    <h1 class="h3 text-center">後台訂單頁</h1>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>購買時間</th>
          <th>Email / 姓名</th>
          <th>地址 / 電話</th>

          <th>留言</th>
          <th>購買品項</th>
          <th class="text-end">應付金額</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, key) in orders.arr" :key="key">
          <tr>
            <td>{{ date(item.create_at) }}</td>
            <td>
              <p class="mb-1">{{ item.user.email }}</p>
              <p class="mb-1">{{ item.user.name }}</p>
            </td>
            <td>
              <p class="mb-1">{{ item.user.address }}</p>
              <p class="mb-1">{{ item.user.tel }}</p>
            </td>
            <td>{{ item.message }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(product, i) in item.products" :key="i">
                  {{ product.product.title }} 數量：{{ product.qty }}
                  {{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-end">${{ item.total }}</td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-if="pagination > 1">
      <PageComponent :pages="pagination" @emitPage="getOrders" />
    </div>
  </div>
</template>
