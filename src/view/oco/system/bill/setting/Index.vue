<template>
  <div>
    <sdModal
      v-if="modal"
      :title="settings.title"
      :visible="modal"
      :onCancel="closeModal"
    >
      <a-form
        :model="settings"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
        labelAlign="left"
        @finish="saveSetting"
      >
        <a-form-item label="契約名稱" name="name">
          <a-input v-model:value="settings.name"> </a-input>
        </a-form-item>
        <a-form-item label="電號" name="no">
          <a-input v-model:value="settings.no"> </a-input>
        </a-form-item>
        <a-form-item label="用電種類" name="type">
          <a-select v-model:value="settings.type" :options="typeOptions" @change="onTypeChange">
          </a-select>
        </a-form-item>
        <a-form-item label="契約" name="contract">
          <a-radio-group
            v-model:value="settings.contract"
            :options="contractOptions"
            @change="onContractChange"
          />
        </a-form-item>
        <a-form-item label="時段" name="timePeriod">
          <a-radio-group
            v-model:value="settings.timePeriod"
            :options="periodOptions"
            @change="onTimePeriodChange"
          />
        </a-form-item>
        
        <!-- 低壓需量契約非時間電價專用欄位 -->
        <a-form-item
          v-if="showLowVoltageDemandFields"
          label="非夏月契約容量"
          name="nonSummerCapacity"
        >
          <a-input v-model:value="settings.nonSummerCapacity" type="number" placeholder="請輸入非夏月契約容量">
          </a-input>
        </a-form-item>
        
        <a-form-item
          v-if="showLowVoltageDemandFields"
          label="經常契約容量"
          name="regularCapacity"
        >
          <a-input v-model:value="settings.regularCapacity" type="number" placeholder="請輸入經常契約容量">
          </a-input>
        </a-form-item>
        
        <a-form-item
          v-if="settings.timePeriod !== 0"
          label="經常契約容量"
          name="capacity"
        >
          <a-input v-model:value="settings.capacity" type="number"> </a-input>
        </a-form-item>
        <a-form-item
          v-if="settings.timePeriod !== 0"
          label="備容量"
          name="spareCapacity"
        >
          <a-input v-model:value="settings.spareCapacity" type="number">
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="settings.timePeriod !== 0"
          label="離峰契約容量"
          name="offPeakCapacity"
        >
          <a-input v-model:value="settings.offPeakCapacity" type="number">
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="settings.timePeriod !== 0"
          label="週六半尖峰契約容量"
          name="satHalfPeakCapacity"
        >
          <a-input v-model:value="settings.satHalfPeakCapacity" type="number">
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="settings.timePeriod !== 0"
          label="非夏月/半尖峰契約容量"
          name="halfPeakCapacity"
        >
          <a-input v-model:value="settings.halfPeakCapacity" type="number">
          </a-input>
        </a-form-item>
        <a-row :gutter="[5, 10]" align="center">
          <a-col>
            <sdButton
              class="act-btn"
              type="primary"
              html-type="submit"
              :disabled="loading"
            >
              儲存
              <a-spin v-show="loading" size="small" />
            </sdButton>
          </a-col>
          <a-col>
            <sdButton class="act-btn" type="light" @click="closeModal">
              取消
            </sdButton>
          </a-col>
        </a-row>
      </a-form>
    </sdModal>

    <a-spin v-if="loading" />
    <DataTables
      v-if="!loading"
      :filterOption="true"
      :filterOnchange="true"
      :tableData="tableData"
      :columns="columns"
      :rowSelection="false"
      :addOption="permission.create"
      :handleAdd="openAddModal"
      :handleDataSearch="search"
    />
  </div>
</template>
<script src="./main.js"></script>
