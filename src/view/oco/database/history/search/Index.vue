<template>
  <div>
    <ModalTable
      v-if="detailModal"
      :columns="columns"
      :tableData="detailTableData"
      :modal="detailModal"
      :title="detailModalTitle"
      :closeModal="closeDetailModal"
      :loading="loading"
    />
    <sdModal
      v-if="addSearchModal"
      :visible="addSearchModal"
      title="新增常用搜尋"
      :onCancel="closeAddSearchModal"
    >
      <a-form :model="addSearchFormState" labelAlign="left">
        <a-form-item
          label="名稱"
          :labelCol="{
            lg: 4,
            xs: 24,
          }"
          :wrapperCol="{
            lg: 20,
            xs: 24,
          }"
        >
          <a-input v-model:value="addSearchFormState.name"></a-input>
        </a-form-item>
        <div style="display: flex; justify-content: end">
          <sdButton type="primary" @click="addSearch"> 儲存 </sdButton>
        </div>
      </a-form>
    </sdModal>
    <sdModal
      v-if="exportModal"
      :visible="exportModal"
      :onCancel="closeExportModal"
      title="匯出"
    >
      <a-form labelAlign="left">
        <a-form-item label="檔案名稱" :labelCol="{ span: 6 }">
          <a-input v-model:value="exportFormState.fileName"></a-input>
        </a-form-item>
        <a-form-item label="使用底稿" :labelCol="{ span: 6 }">
          <a-upload
            name="file"
            :multiple="false"
            accept=".xlsx, .xls, .csv"
            :customRequest="fileUpload"
            @change="onImportFileChange"
          >
            <a-button> 選擇檔案 </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="工作表名稱" :labelCol="{ span: 6 }">
          <a-input v-model:value="exportFormState.worksheetName"></a-input>
        </a-form-item>
        <a-row align="end" :gutter="10">
          <a-col>
            <a-button
              ghost
              type="primary"
              style="height: 45px"
              @click="closeExportModal"
            >
              取消</a-button
            >
          </a-col>
          <a-col>
            <a-button
              type="primary"
              @click="exportFile"
              style="height: 45px"
              :disabled="loading"
            >
              匯出 <a-spin v-show="loading"></a-spin
            ></a-button>
          </a-col>
        </a-row>
      </a-form>
    </sdModal>
    <Search>
      <a-collapse v-model:activeKey="collapseKey">
        <a-collapse-panel key="1" header="條件篩選">
          <HistoryFilter
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :formState="formState"
            @update="updateFormState"
          />
          <sdButton
            class="act-btn"
            type="primary"
            :disabled="!submitable || loading"
            @click="submit"
          >
            {{ searching ? "查詢中.." : "查詢" }}
            <a-spin v-if="searching" size="small" />
          </sdButton>
          <a-button
            type="primary"
            ghost
            style="margin-left: 1rem; height: 44px"
            @click="openAddSearchModal"
          >
            加入常用搜尋
          </a-button>
        </a-collapse-panel>
      </a-collapse>
    </Search>
    <sdCards v-if="showTable" title="搜尋結果">
      <a-spin v-if="searching" />
      <a-button
        type="primary"
        ghost
        style="height: 45px"
        @click="openExportModal"
        >匯出檔案</a-button
      >
      <TableChart
        v-if="chartData.type !== 'none' && !searching"
        :type="chartData.type"
        :labels="chartData.labels"
        :datasets="chartData.datasets"
        :options="chartData.options"
      />
      <a-table
        v-if="!searching"
        :data-source="data"
        :columns="columns"
        :scroll="data.length > 0 ? { x: 1500, y: 500 } : { y: 500 }"
      >
        <template v-if="showSummary" #summary>
          <a-table-summary fixed>
            <a-table-summary-row style="background-color: #fafafa">
              <a-table-summary-cell :index="0">加總</a-table-summary-cell>
              <a-table-summary-cell v-for="v in formState.tags" :key="v.id">{{
                getTotal(v.id)
              }}</a-table-summary-cell>
            </a-table-summary-row>
            <a-table-summary-row style="background-color: #fafafa">
              <a-table-summary-cell :index="0">平均</a-table-summary-cell>
              <a-table-summary-cell v-for="v in formState.tags" :key="v.id">{{
                getAverage(v.id)
              }}</a-table-summary-cell>
            </a-table-summary-row>
            <a-table-summary-row style="background-color: #fafafa">
              <a-table-summary-cell :index="0">最大值</a-table-summary-cell>
              <a-table-summary-cell v-for="v in formState.tags" :key="v.id">{{
                getMaximum(v.id)
              }}</a-table-summary-cell>
            </a-table-summary-row>
            <a-table-summary-row style="background-color: #fafafa">
              <a-table-summary-cell :index="0">最小值</a-table-summary-cell>
              <a-table-summary-cell v-for="v in formState.tags" :key="v.id">{{
                getMinimum(v.id)
              }}</a-table-summary-cell>
            </a-table-summary-row>
          </a-table-summary>
        </template>
      </a-table>
    </sdCards>
  </div>
</template>
<script src="./main.js"></script>
