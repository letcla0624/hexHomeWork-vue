import { reactive } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { useLoading } from "vue-loading-overlay";

export const useFrontProductsStore = defineStore("frontProducts", () => {
  const $loading = useLoading({
    color: "var(--bs-primary)",
  });

  const products = reactive({ arr: [] });
  const getProducts = async () => {
    const loader = $loading.show();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API}/api/${
          import.meta.env.VITE_APP_PATH
        }/products/all`
      );
      loader.hide();
      products.arr = res.data.products;
    } catch (err) {
      loader.hide();
      alert(err.response.data.message);
    }
  };

  return { products, getProducts };
});
