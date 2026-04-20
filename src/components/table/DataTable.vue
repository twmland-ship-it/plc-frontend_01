<template>
  <DataTableStyleWrap>
    <div v-if="showToolbar" class="ninjadash-datatable-filter">
      <div>
        <a-space>
          <sdButton
            v-if="addOption"
            class="act-btn"
            type="primary"
            @click="handleAdd"
          >
            新增
          </sdButton>
          <sdButton
            v-if="backOption"
            size="default"
            :outlined="true"
            type="primary"
            @click="handleBack"
          >
            回上層 {{ backTitle }}
          </sdButton>
        </a-space>
      </div>
      <div v-if="filterOption" class="ninjadash-datatable-filter__right">
        <a-input @change="handleDataSearch" size="default" placeholder="搜尋">
          <template #prefix>
            <unicon name="search"></unicon>
          </template>
        </a-input>
      </div>
    </div>

    <a-row align="end">
      <a-col v-if="importOption" style="margin-bottom: 1rem"
        ><a-button type="primary" ghost @click="handleImport"
          >匯入</a-button
        ></a-col
      >
      <a-col v-if="exportOption" style="margin-bottom: 1rem"
        ><a-button type="primary" ghost @click="handleExport"
          >匯出Excel</a-button
        ></a-col
      >
    </a-row>

    <div class="ninjadasj-datatable">
      <TableWrapper class="table-data-view table-responsive">
        <a-table
          v-if="rowSelection"
          class="ant-table-striped"
          :row-selection="rowSelections"
          :pagination="{
            pageSize: pageSize,
            pageSizeOptions: pageSizeOptions,
            showSizeChanger: showSizeChanger,
          }"
          :showSorterTooltip="showSorterTooltip"
          :childrenColumnName="childrenColumnName"
          :row-class-name="getRowClassName"
          :data-source="tableData"
          :columns="columns"
          @change="handleTableChange"
        >
        </a-table>

        <a-table
          v-else
          :pagination="{
            pageSize: pageSize,
            pageSizeOptions: pageSizeOptions,
            showSizeChanger: showSizeChanger,
          }"
          class="ant-table-striped"
          :showSorterTooltip="showSorterTooltip"
          :childrenColumnName="childrenColumnName"
          :data-source="tableData"
          :row-class-name="getRowClassName"
          :columns="columns"
          @change="handleTableChange"
        >
        </a-table>
      </TableWrapper>
    </div>
  </DataTableStyleWrap>
</template>
<script>
import { defineComponent, computed, ref, unref, watch } from "vue";
import VueTypes from "vue-types";
import { DataTableStyleWrap } from "./Style";
import { TableWrapper } from "@/view/oco/styled";

export default defineComponent({
  emits: ["onSelectChange", "tableChange"],
  components: { DataTableStyleWrap, TableWrapper },
  // expandedRow type
  // {
  //   innerColumns:array,
  //   innerDataProp:string,
  // }
  props: {
    filterOption: VueTypes.bool,
    filterOnchange: VueTypes.bool,
    rowSelection: VueTypes.bool,
    showSizeChanger: VueTypes.bool.def(true),
    defaultSelected: VueTypes.array,
    tableData: VueTypes.array,
    columns: VueTypes.array,
    showSorterTooltip: VueTypes.oneOfType([VueTypes.bool, VueTypes.object]),
    handleDataSearch: VueTypes.func,
    handleAdd: VueTypes.func,
    handleBack: VueTypes.func,
    handleImport: VueTypes.func,
    handleExport: VueTypes.func,
    rowClassFunc: {
      type: Function,
      default: () => {},
    },
    backOption: {
      type: Boolean,
      default: false,
    },
    addOption: {
      type: Boolean,
      default: false,
    },
    exportOption: {
      type: Boolean,
      default: false,
    },
    importOption: {
      type: Boolean,
      default: false,
    },
    expandedRow: {
      type: Object,
      default: null,
    },
    childrenColumnName: {
      type: String,
      default: "children",
    },
    backTitle: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const selectedRowKeys = ref([]); // Check here to configure the default column
    watch(
      () => props.defaultSelected,
      (val) => {
        selectedRowKeys.value = val;
      },
      {
        immediate: true,
      }
    );
    // onMounted(() => {
    //   selectedRowKeys.value = props.defaultSelected;
    // });

    const onSelectChange = (changableRowKeys) => {
      selectedRowKeys.value = changableRowKeys;
      emit("onSelectChange", selectedRowKeys.value);
    };

    const rowSelections = computed(() => {
      return {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        hideDefaultSelections: true,
      };
    });

    const pageSize = ref(10);
    const pageSizeOptions = ref(["10", "20", "50", "100"]);
    const changePageSize = (pagination) => {
      pageSize.value = pagination.pageSize;
    };

    const handleTableChange = (pagination, filters, sorter, extra) => {
      changePageSize(pagination);
      emit("tableChange", pagination, filters, sorter, extra);
    };

    const showToolbar = computed(
      () =>
        !!(
          props.addOption ||
          props.backOption ||
          props.filterOption ||
          props.importOption ||
          props.exportOption
        )
    );

    const getInnerData = ({ record }) => {
      if (props.expandedRow.innerDataProp) {
        return record[props.expandedRow.innerDataProp];
      } else {
        return record.children;
      }
    };

    const getRowClassName = (rowData, index) => {
      return props.rowClassFunc(rowData) ?? index % 2 === 1
        ? "table-striped row-style"
        : "row-style";
    };

    return {
      pageSize,
      pageSizeOptions,
      rowSelections,
      handleTableChange,
      getInnerData,
      getRowClassName,
      showToolbar,
    };
  },
});
</script>
<style scoped>
.ant-table-striped :deep(.table-striped) td {
  background-color: #f0f0f0;
}
:deep(.ant-table-tbody > tr > td.ant-table-cell-row-hover) {
  background-color: #ffc04d !important;
}

:deep(.ant-table-thead > tr > th) {
  background-color: #d1d5db !important;
}
</style>
