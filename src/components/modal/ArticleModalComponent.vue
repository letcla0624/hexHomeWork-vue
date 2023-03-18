<script>
/* global bootstrap */
import { ref, reactive, onMounted, watch } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { UploadAdapterPlugin } from "@/composables/uploadAdapterPlugin.js";
import axios from "axios";

export let articleModal = null;
export default {
  props: {
    article: {
      type: Object,
      default: () => ({}),
    },
    isNew: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["update-article"],
  setup(props, { emit }) {
    const editArticleModal = ref(null);
    const tempArticle = reactive({ obj: { tag: [] } });
    const create_at = ref("");
    const editor = ref(ClassicEditor);
    const editorConfig = ref({
      extraPlugins: [
        function (editor) {
          editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
            new UploadAdapterPlugin(loader);
        },
      ],
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "imageUpload",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
      ],
      image: {
        toolbar: [
          "imageTextAlternative",
          "toggleImageCaption",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
        ],
      },
      mediaEmbed: {
        previewsInData: true,
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
      placeholder: "請輸入文章...",
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
        ],
      },
      language: "zh",
    });

    const enEditor = ref(ClassicEditor);
    const enEditorConfig = ref({
      extraPlugins: [
        function (enEditor) {
          enEditor.plugins.get("FileRepository").createUploadAdapter = (
            loader
          ) => new UploadAdapterPlugin(loader);
        },
      ],
      toolbar: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "blockQuote",
        "|",
        "imageUpload",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
      ],
      image: {
        toolbar: [
          "imageTextAlternative",
          "toggleImageCaption",
          "imageStyle:inline",
          "imageStyle:block",
          "imageStyle:side",
        ],
      },
      mediaEmbed: {
        previewsInData: true,
      },
      table: {
        contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      },
      placeholder: "請輸入英文文章...",
      heading: {
        options: [
          {
            model: "paragraph",
            title: "Paragraph",
            class: "ck-heading_paragraph",
          },
          {
            model: "heading1",
            view: "h1",
            title: "Heading 1",
            class: "ck-heading_heading1",
          },
          {
            model: "heading2",
            view: "h2",
            title: "Heading 2",
            class: "ck-heading_heading2",
          },
        ],
      },
      language: "en",
    });

    watch(props.article, () => {
      tempArticle.obj = {
        ...props.article.obj,
        tag: props.article.obj.tag || [],
      };

      const dateAndTime = new Date(tempArticle.obj.create_at * 1000)
        .toISOString()
        .split("T");
      [create_at.value] = dateAndTime;
    });

    watch(create_at, () => {
      tempArticle.obj.create_at = Math.floor(new Date(create_at.value) / 1000);
    });

    // 主圖上傳
    const fileMainInput = ref(null);
    const statusLoading = ref(false);
    const uploadFileFn = async () => {
      statusLoading.value = true;
      const formData = new FormData();
      formData.append("file-to-upload", fileMainInput.value.files[0]);
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

        tempArticle.obj.imageUrl = res.data.imageUrl;
        statusLoading.value = false;
        res.data.success ? alert("上傳成功") : alert("上傳失敗");
        fileMainInput.value.value = "";
      } catch (err) {
        statusLoading.value = false;
        console.dir(err.response);
      }
    };

    const updateArticle = () => {
      emit("update-article", tempArticle.obj);
    };

    onMounted(() => {
      articleModal = new bootstrap.Modal(editArticleModal.value, {
        keyboard: false,
      });
    });

    return {
      tempArticle,
      create_at,
      props,
      editArticleModal,
      updateArticle,
      editor,
      editorConfig,
      enEditor,
      enEditorConfig,
      fileMainInput,
      statusLoading,
      uploadFileFn,
    };
  },
};
</script>
<template>
  <div
    class="modal fade"
    id="editArticleModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleArticleModalLabel"
    aria-hidden="true"
    ref="editArticleModal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">
            <span v-if="isNew">新增文章</span>
            <span v-else>編輯文章</span>
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
                <label for="title" class="form-label">標題</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="tempArticle.obj.title"
                  placeholder="請輸入標題"
                />
              </div>
              <div class="mb-3">
                <label for="enTitle" class="form-label">enTitle</label>
                <input
                  type="text"
                  class="form-control"
                  id="enTitle"
                  v-model="tempArticle.obj.enTitle"
                  placeholder="請輸入英文標題"
                />
              </div>
              <div class="mb-3">
                <label for="imageUrl" class="form-label">輸入圖片網址</label>
                <input
                  v-model="tempArticle.obj.imageUrl"
                  type="text"
                  class="form-control mb-2"
                  placeholder="請輸入圖片連結"
                />
                <img class="img-fluid" :src="tempArticle.obj.imageUrl" />
              </div>
              <div class="mb-3">
                <label for="fileMainInput" class="form-label"
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
                  id="fileMainInput"
                  ref="fileMainInput"
                  @change="uploadFileFn"
                />
              </div>
              <div class="mb-3">
                <label for="author" class="form-label">作者</label>
                <input
                  type="text"
                  class="form-control"
                  id="author"
                  v-model="tempArticle.obj.author"
                  placeholder="請輸入標題"
                />
              </div>
              <div class="mb-3">
                <label for="photographer" class="form-label">攝影</label>
                <input
                  type="text"
                  class="form-control"
                  id="photographer"
                  v-model="tempArticle.obj.photographer"
                  placeholder="請輸入攝影師"
                />
              </div>
              <div class="mb-3">
                <label for="makeuper" class="form-label">造型</label>
                <input
                  type="text"
                  class="form-control"
                  id="makeuper"
                  v-model="tempArticle.obj.makeuper"
                  placeholder="請輸入造型師"
                />
              </div>
              <div class="mb-3">
                <label for="photoModel" class="form-label">模特</label>
                <input
                  type="text"
                  class="form-control"
                  id="photoModel"
                  v-model="tempArticle.obj.photoModel"
                  placeholder="請輸入模特"
                />
              </div>
              <div class="mb-3">
                <label for="create_at">文章建立日期</label>
                <input
                  type="date"
                  class="form-control"
                  id="create_at"
                  v-model="create_at"
                />
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="tag" class="form-label">標籤</label>
                <div class="row gx-1 mb-3">
                  <div
                    class="col-md-2 mb-1"
                    v-for="(label, key) in tempArticle.obj.tag"
                    :key="key"
                  >
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control"
                        id="tag"
                        v-model="tempArticle.obj.tag[key]"
                        placeholder="請輸入標籤"
                      />
                      <button
                        type="button"
                        class="btn btn-outline-danger"
                        @click="tempArticle.obj.tag.splice(key, 1)"
                      >
                        <i class="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                  <div
                    class="col-md-2 mb-1"
                    v-if="
                      tempArticle.obj.tag[tempArticle.obj.tag.length - 1] ||
                      !tempArticle.obj.tag.length
                    "
                  >
                    <button
                      class="btn btn-outline-primary btn-sm d-block w-100"
                      type="button"
                      @click="tempArticle.obj.tag.push('')"
                    >
                      新增標籤
                    </button>
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="enTag" class="form-label">英文標籤</label>
                <input
                  type="text"
                  class="form-control"
                  id="enTag"
                  v-model="tempArticle.obj.enTag"
                  placeholder="請輸入英文標籤"
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">文章描述</label>
                <textarea
                  type="text"
                  class="form-control"
                  id="description"
                  v-model="tempArticle.obj.description"
                  placeholder="請輸入文章大綱"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="enDescription" class="form-label">
                  enDescription
                </label>
                <textarea
                  type="text"
                  class="form-control"
                  id="enDescription"
                  v-model="tempArticle.obj.enDescription"
                  placeholder="請輸入英文文章大綱"
                ></textarea>
              </div>
              <div class="mb-3">
                <ckeditor
                  :editor="editor"
                  :config="editorConfig"
                  v-model="tempArticle.obj.content"
                />
              </div>
              <div class="mb-3">
                <ckeditor
                  :editor="enEditor"
                  :config="enEditorConfig"
                  v-model="tempArticle.obj.enContent"
                />
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-model="tempArticle.obj.isPublic"
                    id="isPublic"
                  />
                  <label class="form-check-label" for="isPublic">
                    是否公開
                  </label>
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
          <button type="button" class="btn btn-primary" @click="updateArticle">
            {{ isNew ? "新增文章" : "更新文章" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.ck-editor__editable_inline {
  min-height: 300px;
}
</style>
