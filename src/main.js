import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/scss/all.scss";
import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

import axios from "axios";
import VueAxios from "vue-axios";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);

app.mount("#app");
