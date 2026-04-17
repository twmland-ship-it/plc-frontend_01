<template>
  <div>
    <sdModal
      v-if="modal"
      :title="title"
      :visible="modal"
      :onCancel="closeModal"
      :width="1600"
    >
      <sdCards>
        <a-spin v-if="loading"></a-spin>
        <DataTables
          :filterOption="true"
          :filterOnchange="true"
          :tableData="data"
          :columns="columns"
          :rowSelection="rowSelection"
          :handleDataSearch="search"
          @onSelectChange="onSelectChange"
        />
      </sdCards>
    </sdModal>
  </div>
</template>
<script setup>
import { defineProps, onMounted, ref } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useDatatableFilter } from "@/composable/filter.js";
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  modal: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
  },
  columns: {
    type: Array,
    required: true,
  },
  tableData: {
    type: Array,
    required: true,
  },
  closeModal: {
    type: Function,
    required: true,
  },
  rowSelection: {
    type: Boolean,
    default: false,
  },
  onSelectChange: {
    type: Function,
    default: () => {},
  },
});
onMounted(() => {
  data.value = props.tableData;
});
const data = ref([]);
const search = (e) => {
  data.value = useDatatableFilter(props.tableData, e.target.value);
};
</script>
