<script setup>
import { reactive, onMounted } from "vue";
import { useCheckToken } from "@/composables/useCheckToken.js";
import { date } from "@/composables/date.js";
import PageComponent from "@/components/PageComponent.vue";
import EditOrderModalComponent, {
  orderModal,
} from "@/components/modal/EditOrderModalComponent.vue";
import DeleteModal, {
  delModal,
} from "@/components/modal/week7/DelModalComp.vue";
import axios from "axios";
import { useLoading } from "vue-loading-overlay";

const $loading = useLoading({
  color: "var(--bs-primary)",
});

const pagination = reactive({ obj: {} });
const orders = reactive({ arr: [] });
const tempOrder = reactive({ obj: {} });

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

const openModal = (txt, order) => {
  tempOrder.obj = { ...order };
  txt === "delete" ? delModal.show() : orderModal.show();
};

const updatePaid = async (order) => {
  const loader = $loading.show();
  const paid = {
    is_paid: order.is_paid,
  };

  try {
    const res = await axios.put(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/order/${order.id}`,
      { data: paid }
    );

    loader.hide();
    alert(res.data.message);
    orderModal.hide();
    getOrders();
  } catch (err) {
    loader.hide();
    console.log(err.response.data.message);
  }
};

const delOrder = async (tempOrder) => {
  const loader = $loading.show();

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/order/${tempOrder.id}`
    );

    loader.hide();
    alert(res.data.message);
    delModal.hide();
    getOrders();
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
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
          <th class="text-end">付款</th>
          <th class="text-end">編輯</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="order in orders.arr" :key="order.id">
          <tr>
            <td>{{ date(order.create_at) }}</td>
            <td>
              <p class="mb-1">{{ order.user.email }}</p>
              <p class="mb-1">{{ order.user.name }}</p>
            </td>
            <td>
              <p class="mb-1">{{ order.user.address }}</p>
              <p class="mb-1">{{ order.user.tel }}</p>
            </td>
            <td>{{ order.message }}</td>
            <td>
              <ul class="list-unstyled">
                <li v-for="(product, i) in order.products" :key="i">
                  {{ product.product.title }} 數量：{{ product.qty }}
                  {{ product.product.unit }}
                </li>
              </ul>
            </td>
            <td class="text-end">${{ order.total }}</td>
            <td>
              <div class="form-check form-switch d-flex justify-content-end">
                <input
                  class="form-check-input me-2"
                  type="checkbox"
                  :id="`paidSwitch${order.id}`"
                  v-model="order.is_paid"
                  @change="updatePaid(order)"
                />
                <label class="form-check-label" :for="`paidSwitch${order.id}`">
                  <span v-if="order.is_paid">已付款</span>
                  <span v-else>未付款</span>
                </label>
              </div>
            </td>
            <td class="text-end">
              <div class="btn-group">
                <button
                  class="btn btn-outline-primary btn-sm"
                  type="button"
                  @click="openModal('edit', order)"
                >
                  檢視
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  type="button"
                  @click="openModal('delete', order)"
                >
                  刪除
                </button>
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <PageComponent :pages="pagination" @emitPage="getOrders" />
  </div>

  <EditOrderModalComponent
    :order="tempOrder"
    @update-paid="updatePaid"
  ></EditOrderModalComponent>

  <DeleteModal :item="tempOrder" @del-item="delOrder" />
</template>
