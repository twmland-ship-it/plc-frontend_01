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
        <a-form-item label="查詢內容" name="meters">
          <a-radio-group
            :options="modeOptions"
            v-model:value="formState.mode"
          />
        </a-form-item>
        <a-form-item label="電錶選擇" name="meters">
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
          <div style="margin-top: 6px; color: #8c8c8c; font-size: 12px">
            區間採「含結束日」；總電費口徑為「總流動電費 + 基本費 + 營業稅」，不含需量與超約費。
          </div>
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
      <BillWrap v-if="submitted && showSummary">
        <a-row :gutter="[15, 15]">
          <a-col :span="24"><h3>電費總結:</h3></a-col>

          <a-col :xs="24" :sm="24" :md="24"></a-col>
          <a-col :xs="12" :sm="6" :md="6"> 尖峰用電度 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.PeakKwh }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 尖峰流動電費 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.PeakFee }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 半尖峰用電度 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.HalfPeakKwh }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 半尖峰流動電費 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.HalfPeakPeakFee }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 週六半尖峰用電度 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.SaturdayHalfPeakKwh }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 週六半尖峰流動電費 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.SaturdayHalfPeakFee }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 離峰用電度 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.OffPeakKwh }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 離峰流動電費 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{ summaryTable.OffPeakFee }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 總用電度 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{
              summaryTable.OffPeakKwh +
              summaryTable.PeakKwh +
              summaryTable.HalfPeakKwh +
              summaryTable.SaturdayHalfPeakKwh
            }}
          </a-col>
          <a-col :xs="12" :sm="6" :md="6"> 總流動電費 </a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">
            {{
              summaryTable.OffPeakFee +
              summaryTable.PeakFee +
              summaryTable.HalfPeakPeakFee +
              summaryTable.SaturdayHalfPeakFee
            }}
          </a-col>
          <a-col :xs="24" :sm="12" :md="12"></a-col>
          <a-col :xs="12" :sm="6" :md="6">基本費:</a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">{{
            summaryTable.BasicFee
          }}</a-col>
          <a-col :xs="24" :sm="12" :md="12"></a-col>
          <a-col :xs="12" :sm="6" :md="6">營業稅(5%):</a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">{{
            (summaryTable.BasicFee +
              summaryTable.OffPeakFee +
              summaryTable.PeakFee +
              summaryTable.HalfPeakPeakFee +
              summaryTable.SaturdayHalfPeakFee) *
            (0.05).toFixed(2)
          }}</a-col>
          <a-col :xs="24" :sm="12" :md="12"></a-col>
          <a-col :xs="12" :sm="6" :md="6">總電費:</a-col>
          <a-col :xs="12" :sm="6" :md="6" style="text-align: end">{{
            (summaryTable.BasicFee +
              summaryTable.OffPeakFee +
              summaryTable.PeakFee +
              summaryTable.HalfPeakPeakFee +
              summaryTable.SaturdayHalfPeakFee) *
            1.05
          }}</a-col>
        </a-row>
      </BillWrap>
    </a-col>
  </a-row>
</template>
<script src="./main.js"></script>
