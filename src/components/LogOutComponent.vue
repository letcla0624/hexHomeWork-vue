<script setup>
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const props = defineProps({
  routeName: {
    type: String,
    default: "",
  },
});

const backToHome = { name: `${props.routeName}` };

const logOutFn = async () => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_APP_API}/logout`);
    alert(res.data.message);
    router.push(backToHome);

    // 刪除 token
    document.cookie =
      "hexHomeWorkToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  } catch (err) {
    alert(err.response.data.message);
  }
};
</script>

<template>
  <button type="button" class="btn btn-outline-primary" @click="logOutFn">
    登出
  </button>
</template>

<style lang=""></style>
