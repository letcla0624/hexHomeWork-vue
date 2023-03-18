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
    const tempProduct = reactive({ obj: { setSize: [] } });
    const productModal = ref(null);

    watch(props.adminProd, () => {
      tempProduct.obj = {
        ...props.adminProd.obj,
        setSize: props.adminProd.obj.setSize || [],
      };
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

    // 主圖上傳
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
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
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

    // 多圖上傳
    const fileInputs = ref(null);
    const statusArrLoading = ref(false);
    const uploadFileArrFn = async () => {
      statusArrLoading.value = true;
      const formData = new FormData();
      formData.append("file-to-upload", fileInputs.value.files[0]);

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API}/api/${
            import.meta.env.VITE_APP_PATH
          }/admin/upload`,
          formData
        );

        tempProduct.obj.imagesUrl.push(res.data.imageUrl);
        statusArrLoading.value = false;
        res.data.success ? alert("上傳成功") : alert("上傳失敗");
        fileInputs.value.value = "";
      } catch (err) {
        statusArrLoading.value = false;
        console.dir(err.response);
      }
    };

    const removeInputText = (idx) => {
      confirm("確認刪除？")
        ? tempProduct.obj.imagesUrl.splice(idx, 1)
        : tempProduct.obj.imagesUrl;
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
      fileInputs,
      uploadFileFn,
      uploadFileArrFn,
      statusLoading,
      statusArrLoading,
      removeInputText,
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
            class="btn-close btn-close-white"
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
                  v-for="(image, idx) in tempProduct.obj.imagesUrl"
                  :key="idx"
                >
                  <div
                    v-if="tempProduct.obj.imagesUrl[idx] !== ''"
                    class="mb-3"
                  >
                    <label for="imageUrl" class="form-label">圖片網址</label>
                    <div class="input-group">
                      <input
                        v-model="tempProduct.obj.imagesUrl[idx]"
                        type="text"
                        class="form-control"
                        placeholder="請輸入圖片連結"
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="removeInputText(idx)"
                      >
                        <span class="btn-close"></span>
                      </button>
                    </div>
                  </div>
                  <img class="img-fluid" :src="image" />
                </div>
                <div class="mb-3">
                  <label for="fileInputs" class="form-label"
                    >上傳圖片
                    <i
                      v-if="statusArrLoading"
                      class="spinner-border spinner-border-sm text-primary"
                      role="status"
                    >
                      <span class="visually-hidden">Loading...</span>
                    </i>
                  </label>
                  <input
                    type="file"
                    class="form-control"
                    id="fileInputs"
                    ref="fileInputs"
                    @change="uploadFileArrFn"
                  />
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
              <div class="mb-3">
                <label for="enTitle" class="form-label">enTitle</label>
                <input
                  id="enTitle"
                  type="text"
                  class="form-control"
                  placeholder="請輸入英文標題"
                  v-model="tempProduct.obj.enTitle"
                />
              </div>
              <div class="mb-3">
                <label for="subtitle" class="form-label">副標題</label>
                <input
                  id="subtitle"
                  type="text"
                  class="form-control"
                  placeholder="請輸入副標題"
                  v-model="tempProduct.obj.subtitle"
                />
              </div>
              <div class="mb-3">
                <label for="enSubtitle" class="form-label">enSubtitle</label>
                <input
                  id="enSubtitle"
                  type="text"
                  class="form-control"
                  placeholder="請輸入英文副標題"
                  v-model="tempProduct.obj.enSubtitle"
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
                  <label for="origin_enPrice" class="form-label">
                    origin_enPrice
                  </label>
                  <input
                    id="origin_enPrice"
                    v-model.number="tempProduct.obj.origin_enPrice"
                    type="number"
                    step="0.01"
                    pattern="^\d*(\.\d{0,2})?$"
                    min="0.00"
                    class="form-control"
                    placeholder="請輸入美金原價"
                    required
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="enPrice" class="form-label">enPrice</label>
                  <input
                    id="enPrice"
                    v-model.number="tempProduct.obj.enPrice"
                    type="number"
                    step="0.01"
                    pattern="^\d*(\.\d{0,2})?$"
                    min="0.00"
                    class="form-control"
                    placeholder="請輸入美金售價"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="inStock" class="form-label">庫存數量</label>
                  <input
                    id="inStock"
                    v-model.number="tempProduct.obj.in_stock"
                    type="number"
                    min="0"
                    oninput="if(value<0)value=0;"
                    class="form-control"
                    placeholder="請輸入庫存數量"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="productNumber" class="form-label">商品編號</label>
                  <input
                    id="productNumber"
                    v-model.number="tempProduct.obj.product_number"
                    type="text"
                    class="form-control"
                    placeholder="請輸入商品編號"
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="madePlace" class="form-label">製造地</label>
                  <input
                    id="madePlace"
                    v-model.number="tempProduct.obj.made_place"
                    type="text"
                    class="form-control"
                    placeholder="請輸入製造地"
                    required
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="productVolume" class="form-label">體積尺寸</label>
                  <input
                    id="productVolume"
                    type="text"
                    class="form-control"
                    placeholder="請輸入商品體積"
                    v-model="tempProduct.obj.product_volume"
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="made_enPlace" class="form-label">
                    made_enPlace
                  </label>
                  <input
                    id="made_enPlace"
                    v-model.number="tempProduct.obj.made_enPlace"
                    type="text"
                    class="form-control"
                    placeholder="請輸入英文製造地"
                    required
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="product_enVolume" class="form-label">
                    product_enVolume
                  </label>
                  <input
                    id="product_enVolume"
                    type="text"
                    class="form-control"
                    placeholder="請輸入英文商品體積"
                    v-model="tempProduct.obj.product_enVolume"
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="productMaterial" class="form-label">成分</label>
                  <input
                    id="productMaterial"
                    v-model.number="tempProduct.obj.product_material"
                    type="text"
                    class="form-control"
                    placeholder="請輸入商品成分"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="productColors" class="form-label">顏色</label>
                  <input
                    id="productColors"
                    v-model.number="tempProduct.obj.product_colors"
                    type="text"
                    class="form-control"
                    placeholder="請輸入商品顏色"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="product_enMaterial" class="form-label">
                    product_enMaterial
                  </label>
                  <input
                    id="product_enMaterial"
                    v-model.number="tempProduct.obj.product_enMaterial"
                    type="text"
                    class="form-control"
                    placeholder="請輸入英文商品成分"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="product_enColors" class="form-label">
                    product_enColors
                  </label>
                  <input
                    id="product_enColors"
                    v-model.number="tempProduct.obj.product_enColors"
                    type="text"
                    class="form-control"
                    placeholder="請輸入英文商品顏色"
                    required
                  />
                </div>
              </div>
              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="videoId" class="form-label">廣告影片 ID</label>
                  <input
                    id="videoId"
                    v-model.number="tempProduct.obj.videoId"
                    type="number"
                    class="form-control"
                    placeholder="請輸入廣告影片 ID"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="whichModel" class="form-label"
                    >模特穿搭號碼</label
                  >
                  <input
                    id="whichModel"
                    v-model.number="tempProduct.obj.which_model"
                    type="number"
                    class="form-control"
                    placeholder="請輸入模特穿搭號碼"
                    required
                  />
                </div>
              </div>
              <div class="mb-3">
                <label for="setSize" class="form-label">設定尺寸</label>
                <div class="row gx-1 mb-3">
                  <div
                    class="col-md-2 mb-1"
                    v-for="(label, key) in tempProduct.obj.setSize"
                    :key="key"
                  >
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control"
                        id="setSize"
                        v-model="tempProduct.obj.setSize[key]"
                        placeholder="請輸入標籤"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="tempProduct.obj.setSize.splice(key, 1)"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                  <div
                    class="col-md-2 mb-1"
                    v-if="
                      tempProduct.obj.setSize[
                        tempProduct.obj.setSize.length - 1
                      ] || !tempProduct.obj.setSize.length
                    "
                  >
                    <button
                      class="btn btn-outline-primary btn-sm d-block w-100"
                      type="button"
                      @click="tempProduct.obj.setSize.push('')"
                    >
                      新增標籤
                    </button>
                  </div>
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
                  rows="6"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="enDescription" class="form-label">
                  enDescription
                </label>
                <textarea
                  id="enDescription"
                  v-model="tempProduct.obj.enDescription"
                  type="text"
                  class="form-control"
                  placeholder="請輸入英文產品描述"
                  rows="6"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="content"
                  v-model="tempProduct.obj.content"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                  rows="6"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="enContent" class="form-label">enContent</label>
                <textarea
                  id="enContent"
                  v-model="tempProduct.obj.enContent"
                  type="text"
                  class="form-control"
                  placeholder="請輸入英文說明內容"
                  rows="6"
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

<style lang="scss"></style>
