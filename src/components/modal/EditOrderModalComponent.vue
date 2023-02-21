<script>
/* global bootstrap */
import { ref, reactive, onMounted, watch } from "vue";
import { date } from "@/composables/date.js";

export let orderModal = null;
export default {
  props: {
    order: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["update-paid"],
  setup(props, { emit }) {
    const editOrderModal = ref(null);
    const tempOrder = reactive({ obj: {} });

    watch(props.order, () => {
      tempOrder.obj = props.order.obj;
    });

    const updatePaid = () => {
      emit("update-paid", tempOrder.obj);
    };

    onMounted(() => {
      orderModal = new bootstrap.Modal(editOrderModal.value, {
        keyboard: false,
      });
    });

    return {
      props,
      tempOrder,
      editOrderModal,
      date,
      updatePaid,
    };
  },
};
</script>
<template>
  <div
    id="editOrderModal"
    ref="editOrderModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="editOrderModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>訂單細節</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-md-4">
              <h3>用戶資料</h3>
              <table class="table">
                <tbody v-if="tempOrder.obj.user">
                  <tr>
                    <th style="width: 100px">姓名</th>
                    <td>{{ tempOrder.obj.user.name }}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{{ tempOrder.obj.user.email }}</td>
                  </tr>
                  <tr>
                    <th>電話</th>
                    <td>{{ tempOrder.obj.user.tel }}</td>
                  </tr>
                  <tr>
                    <th>地址</th>
                    <td>{{ tempOrder.obj.user.address }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-md-8">
              <h3>訂單細節</h3>
              <table class="table">
                <tbody>
                  <tr>
                    <th style="width: 100px">訂單編號</th>
                    <td>{{ tempOrder.obj.id }}</td>
                  </tr>
                  <tr>
                    <th>下單時間</th>
                    <td>{{ date(tempOrder.obj.create_at) }}</td>
                  </tr>
                  <tr>
                    <th>付款狀態</th>
                    <td>
                      <strong v-if="tempOrder.obj.is_paid" class="text-success"
                        >已付款</strong
                      >
                      <span v-else class="text-muted">尚未付款</span>
                    </td>
                  </tr>
                  <tr>
                    <th>總金額</th>
                    <td>
                      {{ tempOrder.obj.total }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <h3>選購商品</h3>
              <table class="table">
                <thead>
                  <tr></tr>
                </thead>
                <tbody>
                  <tr v-for="item in tempOrder.obj.products" :key="item.id">
                    <th>
                      {{ item.product.title }}
                    </th>
                    <td>{{ item.qty }} / {{ item.product.unit }}</td>
                    <td class="text-end">
                      {{ item.final_total }}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-end">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    value=""
                    id="flexCheckDefault"
                    v-model="tempOrder.obj.is_paid"
                  />
                  <label class="form-check-label" for="flexCheckDefault">
                    <span v-if="tempOrder.obj.is_paid">已付款</span>
                    <span v-else>未付款</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="updatePaid">
            修改付款狀態
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
