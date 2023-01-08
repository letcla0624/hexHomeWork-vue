<script>
/* global bootstrap */
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";

export let delModal = null;
export default {
  props: {
    adminProd: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["get-prods"],
  setup(props, { emit }) {
    const tempProduct = reactive({ obj: {} });
    const delProductModal = ref(null);

    watch(props.adminProd, () => {
      tempProduct.obj = props.adminProd.obj;
    });

    const delProductFn = async () => {
      try {
        const res = await axios.delete(
          `${import.meta.env.VITE_APP_API}/api/${
            import.meta.env.VITE_APP_PATH
          }/admin/product/${tempProduct.obj.id}`
        );
        alert(res.data.message);
        emit("get-prods");
        delModal.hide();
      } catch (err) {
        alert(err.response.data.message);
      }
    };

    onMounted(() => {
      delModal = new bootstrap.Modal(delProductModal.value, {
        keyboard: false,
      });
    });

    return { tempProduct, props, delProductModal, delProductFn };
  },
};
</script>
<template>
  <div
    id="delProductModal"
    ref="delProductModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="delProductModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除
          <strong class="text-danger">{{ tempProduct.obj.title }}</strong>
          商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="delProductFn">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
