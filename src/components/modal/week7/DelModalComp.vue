<script>
/* global bootstrap */
import { ref, onMounted } from "vue";

export let delModal = null;
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ["del-item"],
  setup(props, { emit }) {
    const deleteModal = ref(null);

    const delItem = () => {
      emit("del-item", props.item.obj);
    };

    onMounted(() => {
      delModal = new bootstrap.Modal(deleteModal.value, {
        keyboard: false,
      });
    });

    return { props, deleteModal, delItem };
  },
};
</script>
<template>
  <div
    id="deleteModal"
    ref="deleteModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="deleteModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
          <h5 id="delProductModalLabel" class="modal-title">
            <span>刪除{{ props.item.obj.title }}</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          是否刪除 ID 編號為
          <strong class="text-danger">{{ props.item.obj.id }}</strong>
          項目(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-danger" @click="delItem">
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang=""></style>
