import { createRouter, createWebHashHistory } from "vue-router";
import NProgress from "nprogress";
import GetProducts from "@/views/week1/GetProducts.vue";
import Week2HomeView from "@/views/week2/Week2HomeView.vue";
import ProductsView from "@/views/week2/ProductsView.vue";
import Week3HomeView from "@/views/week3/Week3HomeView.vue";
import EditProductsView from "@/views/week3/EditProductsView.vue";
import Week4HomeView from "@/views/week4/Week4HomeView.vue";
import EditProductsPageView from "@/views/week4/EditProductsPageView.vue";
import FrontCartView from "@/views/week5/FrontCartView.vue";
import UseRouterView from "@/views/week6/UseRouterView.vue";
import Week6HomeView from "@/views/week6/front/HomeView.vue";
import Week6ProductsView from "@/views/week6/front/ProductsView.vue";
import Week6ProdView from "@/views/week6/front/ProdView.vue";
import Week6CartView from "@/views/week6/front/CartView.vue";
import Week6LoginView from "@/views/week6/front/LoginView.vue";
import Week6PageNotFoundView from "@/views/week6/front/PageNotFoundView.vue";
import Week6DashboardView from "@/views/week6/DashboardView.vue";
import Week6AdminProductsView from "@/views/week6/admin/AdminProductsView.vue";
import Week6AdminOrdersView from "@/views/week6/admin/AdminOrdersView.vue";
import Week7LoginView from "@/views/week7/LoginView.vue";
import Week7DashboardView from "@/views/week7/DashboardView.vue";
import Week7AdminProductsView from "@/views/week7/admin/AdminProductsView.vue";
import Week7AdminOrdersView from "@/views/week7/admin/AdminOrdersView.vue";
import Week7AdminCouponsView from "@/views/week7/admin/AdminCouponsView.vue";
import Week7AdminArticlesView from "@/views/week7/admin/AdminArticlesView.vue";

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
  {
    path: "/week5",
    name: "week5/frontCart",
    component: FrontCartView,
  },
  {
    path: "/week6",
    component: UseRouterView,
    children: [
      {
        path: "",
        name: "week6",
        component: Week6HomeView,
      },
      {
        path: "products",
        component: Week6ProductsView,
      },
      {
        path: "prod/:id",
        component: Week6ProdView,
      },
      {
        path: "cart",
        component: Week6CartView,
      },
      {
        path: "login",
        name: "week6/login",
        component: Week6LoginView,
      },
      {
        path: "/:pathMatch(.*)*",
        name: "week6/404",
        component: Week6PageNotFoundView,
      },
    ],
  },
  {
    path: "/week6/admin",
    component: Week6DashboardView,
    children: [
      {
        path: "",
        name: "week6/admin",
        component: Week6AdminProductsView,
      },
      {
        path: "orders",
        component: Week6AdminOrdersView,
      },
    ],
  },
  {
    path: "/week7/login",
    name: "week7/login",
    component: Week7LoginView,
  },
  {
    path: "/week7/admin",
    component: Week7DashboardView,
    children: [
      {
        path: "",
        name: "week7/admin",
        component: Week7AdminProductsView,
      },
      {
        path: "orders",
        component: Week7AdminOrdersView,
      },
      {
        path: "coupons",
        component: Week7AdminCouponsView,
      },
      {
        path: "blogs",
        component: Week7AdminArticlesView,
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
