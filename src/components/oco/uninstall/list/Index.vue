<template>
  <div class="uninstall-status">
    <div
      v-if="staleWarning"
      style="display:flex; justify-content:flex-end; margin-bottom:8px; color:#ff4d4f;"
    >
      因連線問題無法取得最新資料
    </div>

    <sdCards title="電力卸載">
      <a-spin v-if="loading" />

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
          @tableChange="handleTableChange"
        />
      </template>
    </sdCards>
  </div>
</template>

<script src="./main.js"></script>

<style scoped>
/* Fix grouped header rounded corners (notch) + reduce header height */
.uninstall-status :deep(.ant-table-thead > tr > th) {
  border-radius: 0 !important;
  padding: 8px 12px !important;
  line-height: 1.2 !important;
}

.uninstall-status :deep(.ant-table-thead > tr:first-child > th) {
  padding-top: 10px !important;
  padding-bottom: 10px !important;
}

.uninstall-status :deep(.ant-table-thead > tr:last-child > th) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}
</style>
