<template>
  <div>
    <sdPageHeader
      title="可靠度分析"
      class="ninjadash-page-header-main"
      :routes="[
        { breadcrumbName: '警報系統' },
        { breadcrumbName: '可靠度分析' },
      ]"
    ></sdPageHeader>

    <!-- 明細 Modal -->
    <DetailModal
      :key="`detail-modal-${forceUpdate}`"
      :modal="detailModal"
      :title="detailModalTitle"
      :closeModal="closeDetailModal"
      :detailData="currentDetailData"
    />

    <Main>
      <sdCards title="可靠度分析">
        <div v-if="loading" style="text-align: center; padding: 2rem">
          <a-spin size="large" />
        </div>
        
        <div v-else>
          <!-- 系統篩選 -->
          <a-row justify="end" style="margin-bottom: 1rem">
            <a-col>
              <a-space>
                <span>系統</span>
                <a-select v-model:value="selectedSystem" style="min-width: 160px">
                  <a-select-option
                    v-for="opt in systemOptions"
                    :key="opt"
                    :value="opt"
                  >
                    {{ opt }}
                  </a-select-option>
                </a-select>
              </a-space>
            </a-col>
          </a-row>

          <!-- 公式顯示 -->
          <a-alert
            v-if="formulaText"
            :message="formulaText"
            type="info"
            show-icon
            style="margin-bottom: 1rem"
          />

          <!-- 數據表格 -->
          <div class="table-data-view table-responsive">
            <a-table 
              :columns="columns" 
              :data-source="filteredTableData"
              :pagination="mainTablePagination"
              row-key="ErrTagId"
              @change="handleMainTableChange"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'ResultText'">
                  <span>{{ formatReliabilityPercent(record) }}</span>
                </template>
                <template v-else-if="column.key === 'OprSeconds'">
                  <span>{{ formatOprSeconds(record) }}</span>
                </template>
                <template v-if="column.key === 'action'">
                  <a-space>
                    <a-button
                      v-if="permission.update"
                      type="primary"
                      size="small"
                      @click="resetDevice(record)"
                      :loading="resetLoading"
                    >
                      重置
                    </a-button>
                    <a-button
                      v-if="permission.read && hasDetailData(record)"
                      type="default"
                      size="small"
                      @click="showDetail(record)"
                    >
                      明細
                    </a-button>
                    <span
                      v-else-if="permission.read"
                      style="color: #999; font-size: 12px;"
                    >
                      （無明細資料）
                    </span>
                  </a-space>
                </template>
              </template>
            </a-table>
          </div>
        </div>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>

<style scoped>
/* DataGrid 樣式優化 */
:deep(.error-time-row) {
  background-color: #fff2f0 !important;
}

:deep(.error-time-row:hover) {
  background-color: #ffebe6 !important;
}

:deep(.status-time-row) {
  background-color: #f6ffed !important;
}

:deep(.status-time-row:hover) {
  background-color: #edf9e0 !important;
}

/* 分頁樣式優化 */
:deep(.ant-pagination) {
  margin-top: 16px;
  text-align: center;
}

:deep(.ant-pagination-options) {
  margin-left: 16px;
}

/* 表格標題樣式 */
:deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  text-align: center;
}

/* 故障時間表格標題 */
:deep(.error-time-row) .ant-table-thead > tr > th {
  background-color: #fff2f0;
  color: #ff4d4f;
}

/* 運轉時間表格標題 */
:deep(.status-time-row) .ant-table-thead > tr > th {
  background-color: #f6ffed;
  color: #52c41a;
}

/* 表格邊框優化 */
:deep(.ant-table-bordered) .ant-table-tbody > tr > td {
  border-right: 1px solid #f0f0f0;
}

/* 滾動條樣式 */
:deep(.ant-table-body)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.ant-table-body)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.ant-table-body)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
