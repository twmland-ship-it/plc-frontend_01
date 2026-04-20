<template>
  <div class="uninstall-status">
    <div
      v-if="staleWarning"
      style="display:flex; justify-content:flex-end; margin-bottom:8px; color:#ff4d4f;"
    >
      因連線問題無法取得最新資料
    </div>

    <sdCards title="電力卸載">
      <template v-if="!hasLoadedOnce">
        <div style="min-height: 200px" />
      </template>

      <template v-else>
        <a-alert
          v-if="fatalErrorMessage"
          type="error"
          :message="fatalErrorMessage"
          show-icon
          style="margin-bottom: 12px"
        />

        <a-empty
          v-else-if="tableData.length === 0"
          description="尚未設定卸載資料"
        />

        <DataTables
          v-else
          class="uninstall-status__table"
          :filterOption="false"
          :filterOnchange="false"
          :tableData="tableData"
          :columns="columns"
          :rowSelection="false"
          :showSorterTooltip="true"
          :showSizeChanger="false"
          @tableChange="handleTableChange"
        />
      </template>
    </sdCards>
  </div>
</template>

<script src="./main.js"></script>

<style scoped>
/* Grouped header: rounded corners + reduce header height */
.uninstall-status__table :deep(.ant-table-container) {
  border-radius: 10px;
  overflow: hidden;
}

.uninstall-status__table :deep(.ant-table-content) {
  border-radius: 10px;
  overflow: hidden;
}

.uninstall-status :deep(.ant-table-thead > tr > th) {
  padding: 8px 12px !important;
  line-height: 1.2 !important;
}

.uninstall-status :deep(.ant-table-thead > tr > th.ant-table-cell) {
  border: 0 none !important;
}

/* Avoid inner rounded corners on grouped header (Stage1 cell becomes :first-child of last header row) */
.uninstall-status__table
  :deep(.ant-table-thead > tr:last-child > th:first-child) {
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

/* Ensure outer header corners match row rounding */
.uninstall-status__table
  :deep(.ant-table-thead > tr:first-child > th:first-child) {
  border-top-left-radius: 10px !important;
  border-bottom-left-radius: 10px !important;
}

.uninstall-status__table
  :deep(.ant-table-thead > tr:first-child > th:last-child) {
  border-top-right-radius: 10px !important;
  border-bottom-right-radius: 0 !important;
}

.uninstall-status__table
  :deep(.ant-table-thead > tr:last-child > th:last-child) {
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 10px !important;
}

.uninstall-status :deep(.ant-table-thead > tr:first-child > th) {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.uninstall-status :deep(.ant-table-thead > tr:last-child > th) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

/* Two-line header spacing */
.uninstall-status__table :deep(.uninstall-coltitle__line1) {
  line-height: 1.1;
}
.uninstall-status__table :deep(.uninstall-coltitle__line2) {
  margin-top: 2px;
  line-height: 1.1;
}
</style>
