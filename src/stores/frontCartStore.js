import { reactive } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useFrontCartStore = defineStore("frontCart", () => {
  const cart = reactive({ arr: [] });
  const getCarts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/${
          import.meta.env.VITE_APP_PATH
        }/cart`
      );

      cart.arr = res.data.data;
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return { cart, getCarts };
});
