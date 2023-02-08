<script setup>
import { ref, reactive } from "vue";
import axios from "axios";

import { storeToRefs } from "pinia";
import { useFrontCartStore } from "@/stores/frontCartStore.js";

const frontCartStore = useFrontCartStore();
const { cart } = storeToRefs(frontCartStore);
const { getCarts } = frontCartStore;

const loading = ref(false);
const form = ref(null);
const data = reactive({
  user: {
    name: "",
    email: "",
    tel: "",
    address: "",
  },
  message: "",
});

const isPhone = (value) => {
  const phoneNumber = /^(09)[0-9]{8}$/;
  return phoneNumber.test(value) ? true : "需要輸入正確的手機格式";
};

const createOrder = async () => {
  loading.value = true;
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/order`,
      { data }
    );

    alert(res.data.message);
    loading.value = false;
    form.value.resetForm();
    data.message = "";
    getCarts();
  } catch (err) {
    loading.value = false;
    alert(err.response.data.message);
  }
};
</script>
<template>
  <div class="row justify-content-center">
    <VForm
      ref="form"
      class="col-md-6 my-5"
      v-slot="{ errors }"
      @submit="createOrder"
    >
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <VField
          id="email"
          name="email"
          type="email"
          class="form-control"
          :class="{ 'is-invalid': errors['email'] }"
          placeholder="請輸入 Email"
          rules="email|required"
          v-model="data.user.email"
        ></VField>
        <error-message name="email" class="invalid-feedback"></error-message>
      </div>
      <div class="mb-3">
        <label for="name" class="form-label">收件人姓名</label>
        <v-field
          id="name"
          name="收件人姓名"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['收件人姓名'] }"
          placeholder="請輸入姓名"
          rules="required"
          v-model="data.user.name"
        ></v-field>
        <error-message
          name="收件人姓名"
          class="invalid-feedback"
        ></error-message>
      </div>
      <div class="mb-3">
        <label for="tel" class="form-label">收件人電話</label>
        <v-field
          id="tel"
          name="收件人電話"
          type="tel"
          class="form-control"
          :class="{ 'is-invalid': errors['收件人電話'] }"
          placeholder="請輸入電話"
          oninput="value=value.replace(/[^\d]/g,'')"
          :rules="isPhone"
          v-model="data.user.tel"
        ></v-field>
        <error-message
          name="收件人電話"
          class="invalid-feedback"
        ></error-message>
      </div>
      <div class="mb-3">
        <label for="address" class="form-label">收件人地址</label>
        <v-field
          id="address"
          name="收件人地址"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors['收件人地址'] }"
          placeholder="請輸入地址"
          rules="required"
          v-model="data.user.address"
        ></v-field>
        <error-message
          name="收件人地址"
          class="invalid-feedback"
        ></error-message>
      </div>
      <div class="mb-3">
        <label for="message" class="form-label">留言</label>
        <textarea
          name=""
          id="message"
          class="form-control"
          cols="30"
          rows="10"
          v-model="data.message"
        ></textarea>
      </div>
      <div class="text-end">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="cart.arr.final_total === 0 || loading"
        >
          <div
            v-if="loading"
            class="spinner-border spinner-border-sm"
            role="status"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          送出訂單
        </button>
      </div>
    </VForm>
  </div>
</template>

<style lang=""></style>
