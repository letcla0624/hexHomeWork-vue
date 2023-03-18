<script>
/* global bootstrap */
import { ref, reactive, onMounted, watch } from "vue";
import { date } from "@/composables/date.js";

export let couponModal = null;
export default {
  props: {
    coupon: {
      type: Object,
      default: () => ({}),
    },
    isNew: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update-coupon"],
  setup(props, { emit }) {
    const editCouponModal = ref(null);
    const tempCoupon = reactive({ obj: {} });
    const due_date = ref("");

    watch(props.coupon, () => {
      tempCoupon.obj = props.coupon.obj;

      // 將 props.coupon 傳進來的 due_date 時間搓格式轉日期格式 YYYY-MM-DD
      const dateAndTime = new Date(tempCoupon.obj.due_date * 1000)
        .toISOString()
        .split("T");
      due_date.value = dateAndTime[0];
    });

    watch(due_date, () => {
      tempCoupon.obj.due_date = Math.floor(new Date(due_date.value) / 1000);
    });

    const updateCoupon = () => {
      emit("update-coupon", tempCoupon.obj);
    };

    onMounted(() => {
      couponModal = new bootstrap.Modal(editCouponModal.value, {
        keyboard: false,
      });
    });

    return {
      tempCoupon,
      due_date,
      props,
      date,
      editCouponModal,
      updateCoupon,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="couponModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="editCouponModal"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            <span v-if="isNew">新增優惠卷</span>
            <span v-else>編輯優惠卷</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="title">標題</label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="tempCoupon.obj.title"
              placeholder="請輸入標題"
            />
          </div>
          <div class="mb-3">
            <label for="coupon_code">優惠碼</label>
            <input
              type="text"
              class="form-control"
              id="coupon_code"
              v-model="tempCoupon.obj.code"
              placeholder="請輸入優惠碼"
            />
          </div>
          <div class="mb-3">
            <label for="due_date">到期日</label>
            <input
              type="date"
              class="form-control"
              id="due_date"
              v-model="due_date"
            />
          </div>
          <div class="mb-3">
            <label for="price">折扣百分比</label>
            <input
              type="number"
              class="form-control"
              id="price"
              min="0"
              max="100"
              oninput="if(value<0)value=0; else if(value>100)value=100;"
              v-model.number="tempCoupon.obj.percent"
              placeholder="請輸入折扣百分比"
            />
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :true-value="1"
                :false-value="0"
                v-model="tempCoupon.obj.is_enabled"
                id="is_enabled"
              />
              <label class="form-check-label" for="is_enabled">
                是否啟用
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            關閉
          </button>
          <button type="button" class="btn btn-primary" @click="updateCoupon">
            {{ isNew ? "新增優惠卷" : "更新優惠券" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
