import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
window.bootstrap = bootstrap;

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { LoadingPlugin } from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";

import axios from "axios";
import VueAxios from "vue-axios";

import { defineRule, Form, Field, ErrorMessage, configure } from "vee-validate";
import AllRules from "@vee-validate/rules";
import { localize, setLocale } from "@vee-validate/i18n";
import zh_tw from "@vee-validate/i18n/dist/locale/zh_TW.json";

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

configure({
  generateMessage: localize({ tw: zh_tw }),
  validateOnInput: true,
});

setLocale("tw");

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
  (res) => {
    NProgress.done();
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

NProgress.configure({
  showSpinner: false,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(LoadingPlugin);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

app.component("VForm", Form);
app.component("VField", Field);
app.component("ErrorMessage", ErrorMessage);

app.mount("#app");
