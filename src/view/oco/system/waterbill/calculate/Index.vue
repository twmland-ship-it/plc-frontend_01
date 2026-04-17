<template>
  <ModalTable
    v-if="detailModal"
    :columns="detailColumns"
    :tableData="detailTableData"
    :modal="detailModal"
    :title="detailModalTitle"
    :closeModal="closeDetailModal"
    :loading="loading"
  />
  <sdModal
    v-if="exportModal"
    :visible="exportModal"
    :onCancel="closeExportModal"
    title="匯出"
  >
    <a-form labelAlign="left">
      <a-form-item label="檔案名稱" :labelCol="{ span: 6 }">
        <a-input v-model:value="exportFileName"></a-input>
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
            @click="exportReport"
            style="height: 45px"
            :disabled="loading"
          >
            匯出 <a-spin v-show="loading"></a-spin
          ></a-button>
        </a-col>
      </a-row>
    </a-form>
  </sdModal>
  <a-row justify="center">
    <a-col :xs="24" :sm="18" :md="12">
      <a-form
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        labelAlign="left"
      >
        <a-form-item label="水錶選擇" name="meters">
          <MeterSetting
            :selectedMeters="formState.meters"
            @setMeters="setMeters"
          />
        </a-form-item>
        <a-form-item label="查詢期間" name="date">
          <a-range-picker
            v-model:value="formState.date"
            style="width: 100%"
            :bordered="false"
          />
          <PeriodSelect :noToday="true" @setDate="setDate" />
        </a-form-item>
      </a-form>

      <a-row justify="end">
        <sdButton
          class="act-btn"
          type="primary"
          :disabled="!submitable"
          @click.prevent="submit"
        >
          查詢
          <a-spin v-show="loading" size="small" />
        </sdButton>
      </a-row>
      <p v-if="submitted" style="font-size: 28px; font-weight: 700">查詢結果</p>
      <DataTables
        v-if="submitted"
        :filterOption="true"
        :filterOnchange="true"
        :tableData="data"
        :columns="columns"
        :rowSelection="false"
        :addOption="false"
        :exportOption="true"
        :handleDataSearch="search"
        :handleExport="openExportModal"
      />
      <BillWrap v-if="submitted">
        <a-row :gutter="[15, 15]">
          <a-col :span="24"><h3>水費總結(皆已含5%營業稅):</h3></a-col>

          <a-col :xs="24" :sm="24" :md="24"></a-col>

          <a-col :xs="12" :sm="6" :md="6"> 總用水量 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.Consumption }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 總用水費</a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.UsageFee }}
          </a-col>
          <a-col :xs="24" :sm="12" :md="12"></a-col>
          <a-col :xs="12" :sm="6" :md="6">基本費:</a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">{{
            summaryTable.BasicFee
          }}</a-col>

          <a-col :xs="24" :sm="12" :md="12"></a-col>
          <a-col :xs="12" :sm="6" :md="6">總水費:</a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">{{
            (summaryTable.BasicFee + summaryTable.UsageFee).toFixed(2)
          }}</a-col>
        </a-row>
      </BillWrap>
    </a-col>
  </a-row>
</template>
<script src="./main.js"></script>
