import { reactive } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useFrontProductsStore = defineStore("frontProducts", () => {
  const products = reactive({ arr: [] });
  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/${
          import.meta.env.VITE_APP_PATH
        }/products/all`
      );

      products.arr = res.data.products;
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return { products, getProducts };
});
