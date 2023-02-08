<script>
/* global bootstrap */
import { ref, onMounted } from "vue";

export let prodModal = null;
export default {
  props: {
    product: {
      type: Object,
      default: () => ({}),
    },
    loadingCart: {
      type: String,
      default: "",
    },
  },
  emits: ["add-to-cart"],
  setup(props, { emit }) {
    const productModal = ref(null);
    const qty = ref(1);

    const addToCart = (id, qty) => {
      emit("add-to-cart", id, qty);
      defaultQty();
    };

    const defaultQty = () => {
      setTimeout(() => {
        qty.value = 1;
      }, 2000);
    };

    onMounted(() => {
      prodModal = new bootstrap.Modal(productModal.value, {
        keyboard: false,
      });
    });

    return { props, productModal, addToCart, qty };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="productModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
    ref="productModal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="exampleModalLabel">
            <span>{{ props.product.title }}</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <img class="img-fluid" :src="props.product.imagesUrl" alt="" />
            </div>
            <div class="col-sm-6">
              <span class="badge bg-primary rounded-pill">{{
                props.product.category
              }}</span>
              <p>商品描述：{{ props.product.description }}</p>
              <p>商品內容：{{ props.product.content }}</p>
              <div class="h5" v-if="!props.product.price">
                {{ props.product.origin_price }} 元
              </div>
              <del class="h6" v-if="props.product.price"
                >原價 {{ props.product.origin_price }} 元</del
              >
              <div class="h5" v-if="props.product.price">
                現在只要 {{ props.product.price }} 元
              </div>
              <div>
                <div class="input-group">
                  <select class="form-select" v-model="qty">
                    <option v-for="i in 20" :key="`num_${i}`" :value="i">
                      {{ i }}
                    </option>
                  </select>
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="addToCart(props.product.id, qty)"
                    :disabled="props.loadingCart === props.product.id"
                  >
                    <div
                      v-if="props.loadingCart === props.product.id"
                      class="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </div>
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
