import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

import { useLoading } from "vue-loading-overlay";

export const useFrontCartStore = defineStore("frontCart", () => {
  const $loading = useLoading({
    color: "var(--bs-primary)",
  });

  const cart = reactive({ arr: [] });
  const getCarts = async () => {
    const loader = $loading.show();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/${
          import.meta.env.VITE_APP_PATH
        }/cart`
      );

      loader.hide();
      cart.arr = res.data.data;
    } catch (err) {
      loader.hide();
      alert(err.response.data.message);
    }
  };

  const loadingCart = ref("");
  const addToCart = async (product_id, qty = 1) => {
    try {
      loadingCart.value = product_id;

      const data = reactive({ product_id, qty });

      const res = await axios.post(
        `${import.meta.env.VITE_APP_API}/api/${
          import.meta.env.VITE_APP_PATH
        }/cart`,
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

  return { cart, getCarts, loadingCart, addToCart };
});
