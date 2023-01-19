<script setup>
const props = defineProps({
  pages: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["emitPage"]);

const updatePage = (page) => {
  emit("emitPage", page);
};
</script>
<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li class="page-item" :class="{ disabled: !props.pages.obj.has_pre }">
        <a
          class="page-link"
          @click.prevent="updatePage(props.pages.obj.current_page - 1)"
        >
          Previous
        </a>
      </li>
      <li
        v-for="page in props.pages.obj.total_pages"
        :key="`page_${page}`"
        class="page-item"
        :class="{ active: props.pages.obj.current_page === page }"
      >
        <span v-if="page === props.pages.obj.current_page" class="page-link">
          {{ page }}
        </span>
        <a
          v-else
          class="page-link"
          href="#"
          @click.prevent="updatePage(page)"
          >{{ page }}</a
        >
      </li>
      <li class="page-item" :class="{ disabled: !props.pages.obj.has_next }">
        <a
          class="page-link"
          href="#"
          @click.prevent="updatePage(props.pages.obj.current_page + 1)"
        >
          Next
        </a>
      </li>
    </ul>
  </nav>
</template>

<style lang=""></style>
