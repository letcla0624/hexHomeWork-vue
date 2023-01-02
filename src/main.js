import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import axios from "axios";
import VueAxios from "vue-axios";

axios.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    NProgress.done();
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

NProgress.configure({
  showSpinner: false,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

app.mount("#app");
