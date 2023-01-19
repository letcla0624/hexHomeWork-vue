import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import GetProducts from "@/views/week1/GetProducts.vue";
import Week2HomeView from "@/views/week2/Week2HomeView.vue";
import ProductsView from "@/views/week2/ProductsView.vue";
import Week3HomeView from "@/views/week3/Week3HomeView.vue";
import EditProductsView from "@/views/week3/EditProductsView.vue";
import Week4HomeView from "@/views/week4/Week4HomeView.vue";
import EditProductsPageView from "@/views/week4/EditProductsPageView.vue";

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
        component: Week2HomeView,
      },
      {
        path: "products",
        name: "week2/products",
        component: ProductsView,
      },
    ],
  },
  {
    path: "/week3",
    children: [
      {
        path: "",
        name: "week3",
        component: Week3HomeView,
      },
      {
        path: "editProducts",
        name: "week3/editProducts",
        component: EditProductsView,
      },
    ],
  },
  {
    path: "/week4",
    children: [
      {
        path: "",
        name: "week4",
        component: Week4HomeView,
      },
      {
        path: "editProductsPage",
        name: "week4/editProductsPage",
        component: EditProductsPageView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkActiveClass: "active",
});

router.beforeEach((_to, _from, next) => {
  NProgress.start();
  next();
});
router.afterEach(() => {
  NProgress.done();
});

export default router;
