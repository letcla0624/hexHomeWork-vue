<script>
/* global bootstrap */
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";

export let prodModal = null;
export default {
  props: {
    adminProd: {
      type: Object,
      default: () => ({}),
    },
    isNew: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["get-prods"],
  setup(props, { emit }) {
    const tempProduct = reactive({ obj: {} });
    const productModal = ref(null);

    watch(props.adminProd, () => {
      tempProduct.obj = props.adminProd.obj;
    });

    const updateProductFn = async () => {
      let url = `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/product`;
      let httpMethod = "post";

      if (!props.isNew) {
        url = `${import.meta.env.VITE_APP_API}/api/${
          import.meta.env.VITE_APP_PATH
        }/admin/product/${tempProduct.obj.id}`;
        httpMethod = "put";
      }

      try {
        const res = await axios[httpMethod](url, { data: tempProduct.obj });
        emit("get-prods");
        prodModal.hide();
        alert(res.data.message);
      } catch (err) {
        alert(err.response.data.message);
      }
    };

    const fileInput = ref(null);
    const statusLoading = ref(false);
    const uploadFileFn = async () => {
      statusLoading.value = true;
      const formData = new FormData();
      formData.append("file-to-upload", fileInput.value.files[0]);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API}/api/${
            import.meta.env.VITE_APP_PATH
          }/admin/upload`,
          formData
        );
        tempProduct.obj.imageUrl = res.data.imageUrl;
        statusLoading.value = false;
        res.data.success ? alert("上傳成功") : alert("上傳失敗");
        fileInput.value.value = "";
      } catch (err) {
        statusLoading.value = false;
        console.dir(err.response);
      }
    };

    onMounted(() => {
      prodModal = new bootstrap.Modal(productModal.value, {
        keyboard: false,
      });
    });

    return {
      tempProduct,
      props,
      productModal,
      updateProductFn,
      fileInput,
      uploadFileFn,
      statusLoading,
    };
  },
};
</script>
<template>
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            {{ props.isNew ? "新增產品" : "編輯商品" }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <label for="imageUrl" class="form-label">主要圖片</label>
                <input
                  v-model="tempProduct.obj.imageUrl"
                  type="text"
                  class="form-control mb-2"
                  placeholder="請輸入圖片連結"
                />
                <img class="img-fluid" :src="tempProduct.obj.imageUrl" />
              </div>
              <div class="mb-3">
                <label for="fileInput" class="form-label"
                  >或 上傳圖片
                  <i
                    v-if="statusLoading"
                    class="spinner-border spinner-border-sm text-primary"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </i>
                </label>
                <input
                  type="file"
                  class="form-control"
                  id="fileInput"
                  ref="fileInput"
                  @change="uploadFileFn"
                />
              </div>
              <h3 class="mb-3">多圖新增</h3>
              <div v-if="Array.isArray(tempProduct.obj.imagesUrl)">
                <div
                  class="mb-1"
                  v-for="(image, key) in tempProduct.obj.imagesUrl"
                  :key="key"
                >
                  <div class="mb-3">
                    <label for="imageUrl" class="form-label">圖片網址</label>
                    <input
                      v-model="tempProduct.obj.imagesUrl[key]"
                      type="text"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                    />
                  </div>
                  <img class="img-fluid" :src="image" />
                </div>
                <div
                  v-if="
                    !tempProduct.obj.imagesUrl.length ||
                    tempProduct.obj.imagesUrl[
                      tempProduct.obj.imagesUrl.length - 1
                    ]
                  "
                >
                  <button
                    class="btn btn-outline-primary btn-sm d-block w-100"
                    @click="tempProduct.obj.imagesUrl.push('')"
                  >
                    新增圖片
                  </button>
                </div>
                <div v-else>
                  <button
                    class="btn btn-outline-danger btn-sm d-block w-100"
                    @click="tempProduct.obj.imagesUrl.pop()"
                  >
                    刪除圖片
                  </button>
                </div>
              </div>
              <div v-else>
                <button
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="createImages"
                >
                  新增圖片
                </button>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                  v-model="tempProduct.obj.title"
                />
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    id="category"
                    v-model="tempProduct.obj.category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    v-model="tempProduct.obj.unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                  />
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    v-model.number="tempProduct.obj.origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    v-model.number="tempProduct.obj.price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">庫存數量</label>
                  <input
                    id="price"
                    v-model.number="tempProduct.obj.in_stock"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入庫存數量"
                  />
                </div>
              </div>
              <hr />

              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  v-model="tempProduct.obj.description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="description"
                  v-model="tempProduct.obj.content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    id="is_enabled"
                    v-model="tempProduct.obj.is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateProductFn"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
