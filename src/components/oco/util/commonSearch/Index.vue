<template>
  <sdModal
    v-if="commonSearchModal"
    title="常用搜尋"
    :visible="commonSearchModal"
    @cancel="closeCommonSearchModal"
  >
    <a-list
      :loading="loading"
      item-layout="horizontal"
      :data-source="sourceData"
    >
      <template #renderItem="{ item }">
        <a-list-item style="cursor: pointer" @click="useSearch(item.Value)">
          <template #actions>
            <a style="color: #ff8000" @click.stop="deleteSearch(item.Key)"
              >刪除</a
            >
          </template>
          {{ JSON.parse(item.Value)?.name }}
        </a-list-item>
      </template>
    </a-list>
  </sdModal>
  <sdButton
    type="primary"
    style="margin-bottom: 1rem"
    @click="openCommonSearchModal"
    >常用搜尋</sdButton
  >
</template>
<script setup>
import { ref, defineEmits, defineProps } from "vue";

import { Modal } from "ant-design-vue";

const emit = defineEmits(["submit"]);
const props = defineProps({
  sourceData: {
    type: Array,
    default: () => [],
  },
  deleteFunc: {
    type: Function,
    default: () => {},
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const commonSearchModal = ref(false);

const openCommonSearchModal = () => {
  commonSearchModal.value = true;
};

const closeCommonSearchModal = () => {
  commonSearchModal.value = false;
};

const useSearch = (data) => {
  commonSearchModal.value = false;
  emit("submit", JSON.parse(data));
};
const deleteSearch = async (id) => {
  Modal.confirm({
    title: "確定刪除?",
    okText: "確認",
    cancelText: "取消",
    onOk: async () => {
      try {
        await props.deleteFunc(id);
        Modal.success({
          title: "已確認",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    },
  });
};
</script>
