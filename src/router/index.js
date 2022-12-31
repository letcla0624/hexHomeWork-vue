import { createRouter, createWebHashHistory } from "vue-router";
import GetProducts from "@/views/week1/GetProducts.vue";
import HomeView from "@/views/week2/HomeView.vue";
import ProductsView from "@/views/week2/ProductsView.vue";

const routes = [
  {
    path: "/",
    name: "week1/getProducts",
    component: GetProducts,
  },
  {
    path: "/week2",
    children: [
      {
        path: "",
        name: "week2",
        component: HomeView,
      },
      {
        path: "products",
        name: "week2/products",
        component: ProductsView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active",
});

export default router;