<script setup>
import { ref, reactive, onMounted } from "vue";
import { useCheckToken } from "@/composables/useCheckToken.js";
import PageComponent from "@/components/PageComponent.vue";
import CouponModalComponent, {
  couponModal,
} from "@/components/modal/CouponModalComponent.vue";
import DeleteModal, {
  delModal,
} from "@/components/modal/week7/DelModalComp.vue";
import { date } from "@/composables/date.js";
import { useLoading } from "vue-loading-overlay";
import axios from "axios";

const $loading = useLoading({
  color: "var(--bs-primary)",
});

const coupons = reactive({ obj: {} });
let tempCoupon = reactive({
  obj: {
    title: "",
    is_enabled: 0,
    percent: 100,
    code: "",
  },
});
const isNew = ref(false);
const pagination = reactive({ obj: {} });

const getCoupons = async () => {
  const loader = $loading.show();

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/coupons`
    );

    loader.hide();
    coupons.obj = res.data.coupons;
    pagination.obj = res.data.pagination;
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

const openModal = (txt, coupon) => {
  if (txt === "new") {
    isNew.value = true;
    tempCoupon.obj = {
      due_date: new Date().getTime() / 1000,
      title: "",
      is_enabled: 0,
      percent: 0,
      code: "",
    };
    couponModal.show();
  } else if (txt === "edit") {
    isNew.value = false;
    tempCoupon.obj = { ...coupon };
    couponModal.show();
  } else if (txt === "delete") {
    isNew.value = false;
    tempCoupon.obj = { ...coupon };
    delModal.show();
  }
};

const updateCoupon = async (tempCoupon) => {
  let url = `${import.meta.env.VITE_APP_API}/api/${
    import.meta.env.VITE_APP_PATH
  }/admin/coupon`;
  let httpMethod = "post";

  if (!isNew.value) {
    url = `${import.meta.env.VITE_APP_API}/api/${
      import.meta.env.VITE_APP_PATH
    }/admin/coupon/${tempCoupon.id}`;
    httpMethod = "put";
  }

  const loader = $loading.show();

  try {
    const res = await axios[httpMethod](url, { data: tempCoupon });

    loader.hide();
    couponModal.hide();
    alert(res.data.message);
    getCoupons();
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

const delCoupon = async (tempCoupon) => {
  const loader = $loading.show();

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/coupon/${tempCoupon.id}`
    );

    loader.hide();
    alert(res.data.message);
    delModal.hide();
    getCoupons();
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

onMounted(() => {
  useCheckToken();
  getCoupons();
});
</script>

<template>
  <div>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal('new')">
        建立新的優惠券
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>優惠碼</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coupon in coupons.obj" :key="coupon.id">
          <td>{{ coupon.title }}</td>
          <td>{{ coupon.percent }}%</td>
          <td>{{ coupon.code }}</td>
          <td>{{ date(coupon.due_date) }}</td>
          <td>
            <span v-if="coupon.is_enabled === 1" class="text-success"
              >啟用</span
            >
            <span v-else class="text-muted">未啟用</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', coupon)"
              >
                編輯
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', coupon)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PageComponent :pages="pagination" @emitPage="getCoupons" />

    <CouponModalComponent
      :coupon="tempCoupon"
      :is-new="isNew"
      @update-coupon="updateCoupon"
    />

    <DeleteModal :item="tempCoupon" @del-item="delCoupon" />
  </div>
</template>

<style lang="scss" scoped></style>
