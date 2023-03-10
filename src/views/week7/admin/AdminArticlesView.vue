<script setup>
import { ref, reactive, onMounted } from "vue";
import PageComponent from "@/components/PageComponent.vue";
import ArticleModalComponent, {
  articleModal,
} from "@/components/modal/ArticleModalComponent.vue";
import DeleteModal, {
  delModal,
} from "@/components/modal/week7/DelModalComp.vue";
import { useCheckToken } from "@/composables/useCheckToken.js";
import { date } from "@/composables/date.js";
import { useLoading } from "vue-loading-overlay";
import axios from "axios";

const $loading = useLoading({
  color: "var(--bs-primary)",
});

const articles = reactive({ obj: {} });
const tempArticle = reactive({ obj: {} });
const pagination = reactive({ obj: {} });
const isNew = ref(false);

const getArticles = async () => {
  const loader = $loading.show();

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/articles`
    );

    loader.hide();
    articles.obj = res.data.articles;
    pagination.obj = res.data.pagination;
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

const editArticle = async (id) => {
  const loader = $loading.show();

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/article/${id}`
    );

    loader.hide();
    openModal("edit", res.data.article);
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

const openModal = (txt, article) => {
  if (txt === "new") {
    isNew.value = true;
    tempArticle.obj = {
      title: "",
      description: "",
      imageUrl: "",
      tag: [],
      create_at: new Date().getTime() / 1000,
      author: "",
      isPublic: false,
      content: "",
    };
    articleModal.show();
  } else if (txt === "edit") {
    isNew.value = false;
    tempArticle.obj = JSON.parse(JSON.stringify(article));
    articleModal.show();
  } else if (txt === "delete") {
    isNew.value = false;
    tempArticle.obj = { ...article };
    delModal.show();
  }
};

const updateArticle = async (tempArticle) => {
  const loader = $loading.show();

  let url = `${import.meta.env.VITE_APP_API}/api/${
    import.meta.env.VITE_APP_PATH
  }/admin/article`;
  let httpMethod = "post";

  if (!isNew.value) {
    url = `${import.meta.env.VITE_APP_API}/api/${
      import.meta.env.VITE_APP_PATH
    }/admin/article/${tempArticle.id}`;
    httpMethod = "put";
  }

  try {
    const res = await axios[httpMethod](url, { data: tempArticle });

    loader.hide();
    articleModal.hide();
    alert(res.data.message);
    getArticles();
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

const delArticle = async (tempArticle) => {
  const loader = $loading.show();

  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_APP_API}/api/${
        import.meta.env.VITE_APP_PATH
      }/admin/article/${tempArticle.id}`
    );

    loader.hide();
    alert(res.data.message);
    delModal.hide();
    getArticles();
  } catch (err) {
    loader.hide();
    alert(err.response.data.message);
  }
};

onMounted(() => {
  useCheckToken();
  getArticles();
});
</script>

<template>
  <div>
    <div class="text-end mt-4">
      <button class="btn btn-primary" type="button" @click="openModal('new')">
        ??????????????????
      </button>
    </div>
    <table class="table mt-4">
      <thead>
        <tr>
          <th style="width: 200px">??????</th>
          <th style="width: 200px">??????</th>
          <th>??????</th>
          <th style="width: 100px">????????????</th>
          <th style="width: 100px">????????????</th>
          <th style="width: 120px">??????</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles.obj" :key="article.id">
          <td>{{ article.title }}</td>
          <td>{{ article.author }}</td>
          <td>{{ article.description }}</td>
          <td>{{ date(article.create_at) }}</td>
          <td>
            <span v-if="article.isPublic">?????????</span>
            <span v-else>?????????</span>
          </td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                type="button"
                @click="editArticle(article.id)"
              >
                ??????
              </button>
              <button
                class="btn btn-outline-danger btn-sm"
                type="button"
                @click="openModal('delete', article)"
              >
                ??????
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <PageComponent :pages="pagination" @emitPage="getArticles" />

    <ArticleModalComponent
      :article="tempArticle"
      :is-new="isNew"
      @update-article="updateArticle"
    />

    <DeleteModal :item="tempArticle" @del-item="delArticle" />
  </div>
</template>

<style lang="scss" scoped></style>
